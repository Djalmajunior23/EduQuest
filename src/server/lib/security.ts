import xss from 'xss';

/**
 * Sanitiza um valor (string, objeto ou array) recursivamente
 */
export function sanitize(value: any): any {
  if (typeof value === 'string') {
    return xss(value);
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitize(item));
  }

  if (value !== null && typeof value === 'object') {
    const sanitizedObj: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitizedObj[key] = sanitize(value[key]);
      }
    }
    return sanitizedObj;
  }

  return value;
}
