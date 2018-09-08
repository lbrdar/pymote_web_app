/* eslint-disable no-bitwise */

// returns hexadecimal color for given string
export function stringToColor(str) { // eslint-disable-line import/prefer-default-export
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2); // eslint-disable-line prefer-template
  }
  return color;
}
