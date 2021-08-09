import { isObject, camelCase, snakeCase } from 'lodash';

const getTYpe = (key, type) => {
  switch (type) {
    case 'camel':
      return camelCase(key);
    case 'snake':
      return snakeCase(key);
    default:
      return key;
  }
};

const parseData = (data, type) => {
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const obj= {};

    Object.keys(data).forEach((key) => {
      obj[getTYpe(key, type)] = isObject((data)[key])
        ? parseData((data)[key.toString()], type)
        : (data)[key];
    });

    return obj;
  } else if (Array.isArray(data)) {
    return data.map((item) => parseData(item, type));
  }

  return data;
};

export const toSnakeCase = (data) => parseData(data, 'snake');
export const toCamelCase = (data) => parseData(data, 'camel');
