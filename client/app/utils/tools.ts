import I18N from '@/app/utils/I18N';
export const extractParametersByTools = (content: string) => {
  const regex = /\$\$TOOLS\$\$ (.+?) \$\$END\$\$/;
  const match = content.match(regex);
  if (match && match[1]) {
    try {
      const json = JSON.parse(match[1]);
      return json.parameters;
    } catch (error) {
      console.error(I18N.utils.tools.jieXiJSO, error);
    }
  }
  return null;
};

export const extractFullRepoNameFromGitHubUrl = (input: string) => {
  try {
    // Use a regex that matches both full URLs and `username/reponame` format.
    const regex = /^(?:https:\/\/github\.com\/)?([^\/]+)\/([^\/]+)(?:\/.*)?$/;
    const match = input.match(regex);

    if (match && match[1] && match[2]) {
      return `${match[1]}/${match[2]}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error parsing input:', error);
    return null;
  }
};
