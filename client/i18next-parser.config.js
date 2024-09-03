module.exports = {
  locales: ['en', 'zh'], 
  output: 'app/locales/$LOCALE/$NAMESPACE.json', 
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
  input: ['app/**/*.{ts,tsx}'],
};
