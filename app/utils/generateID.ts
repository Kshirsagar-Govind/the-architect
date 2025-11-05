const randomstring = require('randomstring');

export function generateUserId() {
  return randomstring.generate({
    length: 12,
    charset: 'hex',
  });
}
