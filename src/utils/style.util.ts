import { CSSProperties } from 'react';

/**
 * Transform CSS Properties from React to standard CSS
 * 
 * @param cssProperties 
 * @returns 
 */
export function reactCSSPropertyToInlineStyle(cssProperties: CSSProperties): string {
  const keyList = Object.keys(cssProperties);

  return keyList.reduce((acc, key) => {
    const cssKey = kebabCase(key);
    
    // delete ' in value
    const cssValue = cssProperties[key].replace("'", '');

    return `${acc}${cssKey}:${cssValue};`;
  }, '');
}


/**
 * Transform the key from camelCase to kebab-case
 * 
 * @param str 
 * @returns 
 */
function kebabCase(str: string) {
  const regex = new RegExp(/[A-Z]/g);

  return str.replace(regex, (v) => `-${v.toLowerCase()}`);
}