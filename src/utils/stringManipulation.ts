export const ToSnakeCase = (str: string) => {
  return str
    .replace(/\s+/g, '_')
    .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    .replace(/^_/, '')
    .replace(/[^a-z0-9_]/g, '')
    .toLowerCase();
};
