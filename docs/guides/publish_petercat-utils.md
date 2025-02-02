# Maunally

## Debug locally

On project root (where `pyproject.toml` located). 
```bash
pip install -e $PWD
```

Generating distribution archives
The next step is to generate distribution packages for the package. These are archives that are uploaded to the Python Package Index and can be installed by pip.

Make sure you have the latest version of PyPA’s build installed:

```bash
python3 -m pip install --upgrade build
```

Build petercat_utils:

```bash
npm run build:pypi
```

Make sure your have the latest version of twine installed:

> Uploading distributions to https://upload.pypi.org/legacy/
ERROR    InvalidDistribution: Metadata is missing required fields: Name, Version.
         Make sure the distribution includes the files where those fields are
         specified, and is using a supported Metadata-Version: 1.0, 1.1, 1.2,
         2.0, 2.1, 2.2.

Once the error occurs, ensure that the Twine version is 6.0.1.
For more details, refer to the issue here: https://github.com/pypi/warehouse/issues/15611.

```bash
pip install twine==6.0.1
```

Publish it:
```bash
npm run publish:pypi
```