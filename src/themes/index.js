import defaultTheme from './default';

let useTheme = defaultTheme;

const themeMap      = new Map();
const POSTFIX_CLASS = 'ClassName';
const POSTFIX       = 'ThemeClassName';

export default function (diffTheme) {
    if (diffTheme !== useTheme) {
        useTheme = diffTheme;
        //If the theme changes, change the default props.
        for (const [Clazz, current] of themeMap) {
            if (current !== diffTheme) {
                theme(Clazz);
            }
        }
    }
    return useTheme;
}

export const theme = (Clazz) => {

    const current = useTheme[Clazz.displayName];
    if (!current) {
        return Clazz;
    }
    Object.keys(current).reduce(function (ret, key) {
        ret[`${key}ThemeClassName`] = current[key];
        return ret;
    }, Clazz.defaultProps || (Clazz.defaultProps = {}));

    themeMap.set(Clazz, useTheme);

    return Clazz
}

/**
 * Looks in the props for both ThemeClassName
 * and ClassName of the corresponding list of names.
 *
 * @param props
 * @param names
 * @returns {string}
 */

export const themeClass = (props, ...names) => {
    const ret = [];
    for (let i = 0, r = 0, l = names.length; i < l; i++) {
        const name      = names[i];
        const themeName = `${name}${POSTFIX}`;
        const className = `${name}${POSTFIX_CLASS}`;
        if (props[themeName]) {
            ret[r++] = props[themeName];
        }
        if (props[className]) {
            ret[r++] = props[className];
        }
    }
    return ret.join(' ');
}
