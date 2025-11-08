const randomstring = require('randomstring');

export function generateRowId() {
  return randomstring.generate({
    length: 6,
    charset: 'alphanumeric',
  });
}

export function generateUserId() {
  return randomstring.generate({
    length: 12,
    charset: 'hex',
  });
}

export function generateProjectId() {
  return randomstring.generate({
    length: 16,
    charset: 'hex',
  });
}
