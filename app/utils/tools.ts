export const extractParametersByTools = (content: string) => {
  const regex = /\$\$TOOLS\$\$ (.+?) \$\$END\$\$/;
  const match = content.match(regex);
  if (match && match[1]) {
    try {
      const json = JSON.parse(match[1]);
      return json.parameters;
    } catch (error) {
      console.error('解析JSON时发生错误：', error);
    }
  }
  return null;
};
