let replacer_func = (key, value) => {
  return (value !== undefined && value?.type === 'Buffer') ? value.data : value;
};

export function stringify(data) {
  return JSON.stringify(data, replacer_func)
}