const themes = [];
let themeMap = {};
/**
 * Adds a theme to the list of themes, returns a function that will remove said
 * theme
 *
 * @param diffTheme
 */
export default function (diffTheme) {
    themes.unshift(diffTheme);
    themeMap = {};
    return () => {
        const idx = themes.indexOf(diffTheme);
        if (idx > -1) {
            themes.splice(1, 0);
            themeMap = {};
        }
    }
}

/**
 * Looks in the props for both ThemeClassName
 * and ClassName of the corresponding list of names.
 *
 * @param props
 * @param names
 * @returns {string}
 */
export const settings = {
    debug: true,
    warn(...args) {
        if (this.debug) {
            console.warn(...args);
        }
    }
};

export const themeClass = (Clazz) => {
    const { displayName } = Clazz;
    if (!displayName) {
        settings.warn(`no display name for themed class %s`, Clazz);
    }

    return (...names) => {
        const cacheKey = `${displayName}/${names.join('.')}`;
        if (cacheKey in themeMap) {
            return themeMap[cacheKey];
        }
        const notfound    = [];
        const ret         = [];
        const themeLength = themes.length;
        for (let i = 0, r = 0, l = names.length; i < l; i++) {
            const name = names[i];
            if (name == null || name.trim() == '') {
                continue;
            }
            let found = false;
            for (let t = 0; t < themeLength; t++) {
                const current = themes[t][displayName];
                if (current && current[name]) {
                    ret[r++] = current[name];
                    found    = true;
                }
            }
            //if no matching classes are found pass it through.
            if (!found) {
                notfound.push(name);
                ret[r++] = name;
            }
        }
        if (notfound.length) {
            settings.warn(`could not find a className for '%s' for '%s' `,
                displayName, notfound.join(' '));
        }

        return (themeMap[cacheKey] = ret.join(' '));
    };
}
