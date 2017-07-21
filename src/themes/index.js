import defaultTheme from './default';

let themes = [defaultTheme];

export default function (diffTheme) {
    themes.unshift(diffTheme);
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
    for (let i = 0, r = 0, l = names.length; i < l; i++) {
        for (let t = 0; t < themeLength; t++) {
            const current = themes[t][displayName];
            const name    = names[i];
            if (current && current[name]) {
                ret[r++] = current[name];
            }
        }
    }
    return ret.join(' ');
};
