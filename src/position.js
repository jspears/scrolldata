import { result } from './util';

/**
 * This is the magic .  Positions things, see's whats in view.
 * Its meant to be fast not pretty. It may be called hundreds
 * of times a second (while scrolling) so built for speed not
 * for comfort.
 *
 * @param newScrollTo
 * @param newOffsetTop
 * @param props
 * @param cachedData
 * @returns {*}
 */
export default function position(newScrollTo, newOffsetTop, props,
                                 cachedData = []) {
    const { rowHeight, rowCount, rowsVisible, height } = props;
    if (newScrollTo == null && newOffsetTop == null) {
        newScrollTo = 0;
    }
    const totalRows = result(rowCount);

    let totalHeight     = 0;
    let data            = [];
    let newOffsetHeight = newOffsetTop == null ? 0 : newOffsetTop;
    let viewHeight      = 0;
    let viewRowCount    = 0;
    for (let rowIndex = 0, r = 0; rowIndex < totalRows; rowIndex++) {
        const rowIndexHeight = result(rowHeight, rowIndex);
        if (newOffsetTop != null) {
            //are we within the scrollTop?
            if (newOffsetTop >= totalHeight && ( newOffsetTop <= totalHeight
                                                 + rowIndexHeight)) {
                //this is the newScrollTo now.
                newScrollTo = rowIndex;
            }
        }
        //when we have a newScrollTo
        if (newScrollTo === rowIndex) {
            newOffsetHeight = totalHeight;
            data[r++]       = rowIndex;
            data[r++]       = rowIndexHeight;
            viewHeight      = rowIndexHeight;
            viewRowCount++;
            totalHeight += rowIndexHeight;
            //handle rowsVisible.
            if (rowsVisible > 0) {
                for (; viewRowCount < rowsVisible && rowIndex++ < totalRows;
                       viewRowCount++) {

                    const rHeight = result(rowHeight, rowIndex);
                    data[r++]     = rowIndex;
                    data[r++]     = rHeight;
                    viewHeight    = viewHeight + rHeight;
                    totalHeight += rHeight;
                }
            } else {
                for (; viewHeight < height && ++rowIndex < totalRows;
                       viewRowCount++) {

                    const rHeight = result(rowHeight, rowIndex);
                    data[r++]     = rowIndex;
                    data[r++]     = rHeight;
                    viewHeight    = viewHeight + rHeight;
                    totalHeight += rHeight;
                }

                if (viewHeight < height && newScrollTo > 0) {
                    //backup 1 and try again, so we can attempt to fill the
                    // area.
                    return position(newScrollTo - 1, null, props, cachedData)
                }
            }
            continue;
        }
        totalHeight += rowIndexHeight;

    }
    //we don't want cached data to cause a state change
    if (cachedData.length === data.length) {
        let same = true;
        for (let i = 0, l = data.length; i < l; i++) {
            if (data[i] !== cachedData[i]) {
                same = false;
                break;
            }
        }
        data = same ? cachedData : data;
    }
    return {
        viewHeight,
        rowCount,
        data,
        rowIndex    : newScrollTo,
        totalHeight,
        offsetHeight: newOffsetHeight
    }
}
