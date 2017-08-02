import React from 'react';
import expect from "expect";
import ExpandableScroller from '../src/ExpandableScroller';
import { into } from './support';

const rowData = (rowIndex, count) => {
    const ret = Array(count);
    for (let i = 0; i < count; i++) {
        ret[i] = `${rowIndex + i} - ${i} ${rowIndex}  ${count}`
    }
    return ret;
};

const renderItem = (r) => {

    const {
              rowIndex, rowHeight,
              onToggle, isExpanded,
              data,
              ...props
          } = r;
    let ret = data || 'nodata';
    return <div {...props} onClick={onToggle} data-row-index={rowIndex} style={{
        maxHeight: rowHeight,
        minHeight: rowHeight,
        border   : '1px solid blue',
        width    : '100%'
    }}>{isExpanded ? `Expanded

    ${ret}
    ` : ret}</div>
};

describe("ExpandableScroller", function () {
    this.timeout(50000);

    it('should render', function () {
        const app = into(<ExpandableScroller expandedHeight={100}
                                             rowHeight={30}
                                             rowData={rowData}
                                             renderItem={(rowIndex, height,
                                                          ...props) =>
                                                 <div {...props}/>}
                                             rowCount={0} height={500}
                                             width={500}/>, true);
        expect(app).toExist();
    });
    it('should render one rowCount 1', function () {
        const app = into(<ExpandableScroller expandedHeight={100}
                                             rowHeight={30}
                                             rowData={rowData}
                                             renderItem={renderItem}
                                             rowCount={1} height={500}
                                             width={500}/>, true);
        expect(app).toExist();
    });
    it('should render 2 rowCount 2', function () {
        const app = into(<ExpandableScroller expandedHeight={100}
                                             rowHeight={30}
                                             rowData={rowData}
                                             renderItem={renderItem}
                                             rowCount={2} height={500}
                                             width={500}/>, true);
        expect(app).toExist();
    });

    it('should rowCount 20 scrollTo 10', function () {
        const app = into(<ExpandableScroller expandedHeight={100}
                                             rowHeight={20}
                                             rowData={rowData}
                                             renderItem={renderItem}
                                             rowCount={20}
                                             height={200}
                                             width={500}
                                             scrollTo={11}
        />, true);
        expect(app).toExist();
    });
    it('should rowCount 20 scrollTo 0 expanded 0', function () {
        const app = into(<ExpandableScroller expandedHeight={100}
                                             expanded={[0]}
                                             rowHeight={20}
                                             rowData={rowData}
                                             renderItem={renderItem}
                                             rowCount={20}
                                             height={200}
                                             width={500}
                                             scrollTo={0}
        />, true);
        expect(app).toExist();
    });
    it('should rowCount 20 scrollTo 10 expanded 11,20', function () {
        const app = into(<ExpandableScroller expandedHeight={100}
                                             expanded={[11, 20]}
                                             rowHeight={20}
                                             rowData={rowData}
                                             renderItem={renderItem}
                                             rowCount={20}
                                             height={200}
                                             width={500}
                                             scrollTo={10}
        />, true);
        expect(app).toExist();
    });

    it('should rowCount 20 scrollTo 20 expanded 11,20', function () {
        const app = into(<ExpandableScroller expandedHeight={100}
                                             expanded={[11, 20]}
                                             rowHeight={20}
                                             rowData={rowData}
                                             renderItem={renderItem}
                                             rowCount={20}
                                             height={200}
                                             width={500}
                                             scrollTo={19}
        />, true);
        expect(app).toExist();
    });
});
