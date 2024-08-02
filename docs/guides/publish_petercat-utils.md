# Maunally

Generating distribution archives
The next step is to generate distribution packages for the package. These are archives that are uploaded to the Python Package Index and can be installed by pip.

Make sure you have the latest version of PyPA’s build installed:

```bash
python3 -m pip install --upgrade build
```

Build petercat_utils:

```bash
cd petercat_utils
python3 -m build
```

Make sure your have the latest version of twine installed:

```bash
pip install twine
```

Publish it:
```bash
npm run publish:pypi
```