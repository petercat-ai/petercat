
import boto3
import io
import toml
import argparse
import yaml

S3_BUCKET = "petercat-env-variables"
ENV_FILE = ".env"
LOCAL_ENV_FILE = "./server/.env"

s3 = boto3.resource('s3')
obj = s3.Object(S3_BUCKET, ENV_FILE)

def pull_envs():
  data = io.BytesIO()

  obj.download_fileobj(data)

  with open(LOCAL_ENV_FILE, 'wb') as f:
    f.write(data.getvalue())

def snake_to_camel(snake_str):
    """Convert snake_case string to camelCase."""
    components = snake_str.lower().split('_')
    # Capitalize the first letter of each component except the first one
    return ''.join(x.title() for x in components)

def load_env_file(env_file):
    """Load the .env file and return it as a dictionary with camelCase keys."""
    env_vars = {}
    with open(env_file, 'r') as file:
        for line in file:
            line = line.strip()
            if line and not line.startswith('#'):  # Skip empty lines and comments
                key, value = line.split('=', 1)
                camel_case_key = snake_to_camel(key.strip())
                env_vars[camel_case_key] = value.strip()
    return env_vars

def generate_cloudformation_parameters(env_vars):
    """Generate CloudFormation Parameters from dot-separated keys in env_vars."""
    parameters = {}
    for param_name in env_vars:
        parameters[param_name] = {
            'Type': 'String',
            'Description': f"Parameter for {param_name}"
        }
    return parameters

class Ref:
    """Custom representation for CloudFormation !Ref."""
    def __init__(self, ref):
        self.ref = ref

def ref_representer(dumper, data):
    """Custom YAML representer for CloudFormation !Ref."""
    return dumper.represent_scalar('!Ref', data.ref, style='')

def update_cloudformation_environment(env_vars = {}, cloudformation_template = "template.yml"):
    """Update Environment Variables in CloudFormation template to use Parameters."""
    def cloudformation_tag_constructor(loader, tag_suffix, node):
        """Handle CloudFormation intrinsic functions like !Ref, !GetAtt, etc."""
        return loader.construct_scalar(node)
    
    # Register constructors for CloudFormation intrinsic functions
    yaml.SafeLoader.add_multi_constructor('!', cloudformation_tag_constructor)
    yaml.SafeDumper.add_representer(Ref, ref_representer)

    with open(cloudformation_template, 'r') as file:
        template = yaml.safe_load(file)
    
    parameters = generate_cloudformation_parameters(env_vars)
    print(f"---> generate_cloudformation_parameters: {parameters}")
    # Add parameters to the CloudFormation template
    if 'Parameters' not in template:
        template['Parameters'] = {}
    template['Parameters'].update(parameters)
    
    # Update environment variables in the resources
    for resource in template.get('Resources', {}).values():
        if 'Properties' in resource and 'Environment' in resource['Properties']:
            env_vars_section = resource['Properties']['Environment'].get('Variables', {})
            for key in env_vars_section:
                camel_key = snake_to_camel(key)
                print(f"Environment Variables {camel_key}")

                if camel_key in env_vars:
                    env_vars_section[key] = Ref(camel_key)

    # Save the updated CloudFormation template
    with open(cloudformation_template, 'w') as file:
        yaml.safe_dump(template, file, default_style=None, default_flow_style=False)

def load_config_toml(toml_file):
    """Load the config.toml file and return its content as a dictionary."""
    with open(toml_file, 'r') as file:
        config = toml.load(file)
    return config

def update_parameter_overrides(config, env_vars):
    """Update the parameter_overrides in the config dictionary with values from env_vars."""
    parameter_overrides = [f"{key}={value}" for key, value in env_vars.items()]
    config['default']['deploy']['parameters']['parameter_overrides'] = parameter_overrides
    return config

def save_config_toml(config, toml_file):
    """Save the updated config back to the toml file."""
    with open(toml_file, 'w') as file:
        toml.dump(config, file)

def update_config_with_env(env_file: str = LOCAL_ENV_FILE, toml_file = ".aws/petercat-preview.toml"):
    """Load env vars from a .env file and update them into a config.toml file."""
    pull_envs()

    env_vars = load_env_file(env_file)
    config = load_config_toml(toml_file)
    updated_config = update_parameter_overrides(config, env_vars)
    save_config_toml(updated_config, toml_file)

    update_cloudformation_environment(env_vars)

def main():
    parser = argparse.ArgumentParser(description="Update config.toml parameter_overrides with values from a .env file.")

    subparsers = parser.add_subparsers(dest='command', required=True, help='Sub-command help')
    pull_parser = subparsers.add_parser('pull', help='Pull environment variables from a .env file and update samconfig.toml')

    pull_parser.add_argument(
        '-e', '--env', 
        type=str, 
        default=LOCAL_ENV_FILE, 
        help='Path to the .env file (default: .env)'
    )

    pull_parser.add_argument(
        '-t', '--template', 
        type=str, 
        required=True, 
        default=".aws/petercat-preview.toml",
        help='Path to the CloudFormation template file'
    )

    args = parser.parse_args()

    if args.command == 'pull':
        update_config_with_env(args.env, args.template)

if __name__ == "__main__":
    main()