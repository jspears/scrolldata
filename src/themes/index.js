import defaultTheme from './default';

let themes   = [defaultTheme];
let themeMap = {};
export default function (diffTheme) {
    themes.push(diffTheme);
    themeMap = {};
}

/**
 * Looks in the props for both ThemeClassName
 * and ClassName of the corresponding list of names.
 *
 * @param props
 * @param names
 * @returns {string}
 */

export const themeClass = ({ displayName }) => (...names) => {
    const ret         = [];
    const themeLength = themes.length;
    const cacheKey    = names.join(`${displayName}/`);
    if (cacheKey in themeMap) {
        return themeMap[cacheKey];
    }
    for (let i = 0, r = 0, l = names.length; i < l; i++) {
        const name = names[i];
        for (let t = 0; t < themeLength; t++) {
            const current = themes[t][displayName];
            if (current && current[name]) {
                ret[r++] = current[name];
            }
        }
    }
    return (themeMap[cacheKey] = ret.join(' '));
};
