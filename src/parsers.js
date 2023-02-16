import yaml from 'js-yaml';

const formats = {
  json: JSON.parse,
  yml: yaml.load,
  yaml:  yaml.load
};

export default (data, dataType) => {
  const parse = formats[dataType];

  if (parse === undefined) return undefined;

  return parse(data);
};