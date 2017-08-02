import theme, { themeClass, settings } from '../src/themes';
import expect from 'expect';
import { execLoop } from '../src/util'

describe('theme', function () {
    it('should return in the right order', function () {
        const d  = [
            theme({ A: { test: 1 } }),
            theme({ B: { test: 3 } }),
            theme({ A: { test: 2 } })
        ];
        const tc = themeClass({ displayName: 'A' });

        expect(tc('test')).toEqual('2 1')
        d.forEach(execLoop);
    });
    it('should return unknown class', function () {
        const d       = [
            theme({ A: { test: 1 } }),
            theme({ B: { test: 3 } }),
            theme({ A: { test: 2 } })
        ];
        const owarn   = settings.warn;
        const capture = [];
        settings.warn = (...args) => capture.push(args);

        const tc = themeClass({ displayName: 'A' });
        expect(tc('stuff')).toEqual('stuff');
        expect(capture.length).toEqual(1);
        expect(capture[0][0])
            .toEqual(`could not find a className for '%s' for '%s' `);
        expect(capture[0][1]).toEqual('A');
        expect(capture[0][2]).toEqual(['stuff']);

        d.forEach(execLoop);
        settings.warn = owarn;
    });

});
