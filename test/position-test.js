import position from '../src/position';
import expect from 'expect';


describe('position', function () {


    it('should find height and position', function () {

        const ret = position(0, null,
            { rowHeight: 50, rowCount: 100, height: 500 });

        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 0,
            rowCount    : 100,
            rowIndex    : 0,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data.length).toBe(20);
        expect(data).toEqual(
            [0, 50, 1, 50, 2, 50, 3, 50, 4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50]);

    });
    it('should find height and position half way', function () {

        const ret = position(4, null,
            { rowHeight: 50, rowCount: 100, height: 500 });

        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 200,
            rowCount    : 100,
            rowIndex    : 4,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data).toEqual(
            [4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50, 10, 50, 11, 50, 12, 50, 13, 50]);

    });
    it('should find height and position using cached', function () {

        const origData = [0, 50, 1, 50, 2, 50, 3, 50, 4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50];
        const ret      = position(0, null,
            { rowHeight: 50, rowCount: 100, height: 500 }, origData);

        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 0,
            rowCount    : 100,
            rowIndex    : 0,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data.length).toBe(20);
        expect(data).toBe(origData);

    });
    it('should find height and position breaking cached', function () {

        const origData = [10, 100, 11, 100, 12, 100, 13, 100, 14, 50];
        const ret      = position(10, null,
            { rowHeight: 100, rowCount: 100, height: 500 }, origData);

        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 1000,
            rowCount    : 100,
            rowIndex    : 10,
            totalHeight : 10000,
            viewHeight  : 500
        });
        expect(data, 'should not ').toNotEqual(origData);
        expect(data).toNotBe(origData);

    });
    it('should find height and position not 0', function () {

        const ret = position(null, 20,
            { rowHeight: 50, rowCount: 100, height: 500 });

        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 0,
            rowCount    : 100,
            rowIndex    : 0,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data.length).toBe(20);
        expect(data).toEqual(
            [0, 50, 1, 50, 2, 50, 3, 50, 4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50]);

    });
    it('should find rowsVisible and position 0', function () {
        const ret               = position(0, null,
            { rowHeight: 50, rowCount: 100, rowsVisible: 10 });
        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 0,
            rowCount    : 100,
            rowIndex    : 0,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data.length).toBe(20);
        expect(data).toEqual(
            [0, 50, 1, 50, 2, 50, 3, 50, 4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50]);

    });
    it('should find rowsVisible and scrollTo', function () {
        const ret               = position(1, null,
            { rowHeight: 50, rowCount: 100, rowsVisible: 10 });
        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 50,
            rowCount    : 100,
            rowIndex    : 1,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data.length).toBe(20);
        expect(data).toEqual(
            [1, 50, 2, 50, 3, 50, 4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50, 10, 50,]);

    });

    it('should find rowsVisible,and position ', function () {
        const ret               = position(null, 55,
            { rowHeight: 50, rowCount: 100, rowsVisible: 10 });
        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 50,
            rowCount    : 100,
            rowIndex    : 1,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data.length).toBe(20);
        expect(data).toEqual(
            [1, 50, 2, 50, 3, 50, 4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50, 10, 50,]);

    });

    it('should find height, and position', function () {
        const ret               = position(null, 55,
            { rowHeight: 50, rowCount: 100, height: 500 });
        const { data, ...rest } = ret;
        expect(rest).toEqual({
            offsetHeight: 50,
            rowCount    : 100,
            rowIndex    : 1,
            totalHeight : 5000,
            viewHeight  : 500
        });
        expect(data.length).toBe(20);
        expect(data).toEqual(
            [1, 50, 2, 50, 3, 50, 4, 50, 5, 50, 6, 50, 7, 50, 8, 50, 9, 50, 10, 50,]);

    });

    it('should backup to fill the area', function () {
        const ret               = position(9, null,
            { rowHeight: 100, rowCount: 10, height: 500 });
        const { data, ...rest } = ret;
        expect(data).toEqual([5, 100, 6, 100, 7, 100, 8, 100, 9, 100]);

        expect(rest).toEqual({
            offsetHeight: 500,
            rowCount    : 10,
            rowIndex    : 5,
            totalHeight : 1000,
            viewHeight  : 500
        });

    });
    it('should fill the bottom', function () {
        const ret               = position(5, null,
            { rowHeight: 100, rowCount: 10, height: 500 });
        const { data, ...rest } = ret;

        expect(rest).toEqual({
            offsetHeight: 500,
            rowCount    : 10,
            rowIndex    : 5,
            totalHeight : 1000,
            viewHeight  : 500
        });
        expect(data).toEqual([5, 100, 6, 100, 7, 100, 8, 100, 9, 100]);

    });
    it('should backup to do da math', function () {
        const ret               = position(1, null,
            {
                rowHeight(rowIndex) {
                    return rowIndex + 5
                }, rowCount: 3, height: 500
            });
        const { data, ...rest } = ret;
        expect(data).toEqual([0, 5, 1, 6, 2, 7]);

        expect(rest).toEqual({
            offsetHeight: 0,
            rowCount    : 3,
            rowIndex    : 0,
            totalHeight : 18,
            viewHeight  : 18
        });


    });
    it('should do one scrollTo', function () {
        const ret               = position(0, null, {
            rowHeight: 50,
            rowCount : 1,
            height   : 500
        });
        const { data, ...rest } = ret;
        expect(data).toEqual([0, 50]);

        expect(rest).toEqual({
            offsetHeight: 0,
            rowCount    : 1,
            rowIndex    : 0,
            totalHeight : 50,
            viewHeight  : 50
        });


    });
});
