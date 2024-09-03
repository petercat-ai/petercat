module.exports = {
  locales: ['zh', 'en'], 
  output: 'public/locales/$LOCALE/$NAMESPACE.json', 
  defaultNamespace: 'common',
  keySeparator: false, 
  namespaceSeparator: false,
  interpolation: {
    prefix: '{{',
    suffix: '}}',
  },
  reactNamespace: false,
  useKeysAsDefaultValue: true,
  verbose: true,
  createOldCatalogs: false, 
  resetDefaultValueLocale: null, 
  input: ['app/**/*.{ts,tsx}'],
};
