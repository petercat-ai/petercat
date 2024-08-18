module.exports = (content) => {
  return `import '../.dumi/tmp/tailwind.css';\n${content}`;
}
