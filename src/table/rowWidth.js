export default function (columns = []) {
    let rowWidth = 0;

    for (let i = 0, l = columns.length; i < l; i++) {
        const col = columns[i];
        if (col.selectable) {
            rowWidth += col.width || 30;
        } else if (!col.hidden) {
            rowWidth += col.width;
        }
    }
    return rowWidth;
}
