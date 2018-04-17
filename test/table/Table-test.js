import React from 'react';
import TableScroller from '../../src/table/TableScroller';
import { into } from '../support';
import '../../src/themes/default/index';

const statusRender = ({ rowIndex, width, height }) => {
    return <div
        style={{
            width,
            height,
            background: (rowIndex % 2 ? 'red' : 'green')
        }}/>
};
const columns      = [{
    columnKey          : 'status',
    cellHeaderClassName: 'TableScroller__status',
    label              : '',
    width              : 5,
    sortable           : false,
    resizable          : false,
    label              : false,
    formatter          : statusRender

},
    {
        'selectable': true,
        'columnKey' : '_id'
    },
    {
        columnKey: '_id',
        label    : 'id',
        width    : 200,
        sortable : true,
        resizable: true,
    },
    {
        columnKey: 'contentPartner',
        label    : 'Partner',
        width    : 200,
        sortable : true,
    },
    {
        columnKey: 'contentPartner0',
        label    : 'Partner 0',
        width    : 200,
        sortable : true,
    },
    {
        columnKey: 'contentPartner1',
        label    : 'Partner 1',
        width    : 200,
        sortable : true,
    },
    {
        columnKey: 'contentPartner2',
        label    : 'Content 2 Partner2',
        width    : 200,
        sortable : true,
    }];
describe('Table', function () {
    this.timeout(50000);

    const rowData = (rowIndex, count) => {
        const ret = Array(count);
        for (let i = 0; i < count; i++) {
            ret[i] = {
                status         : i % 2,
                _id            : `${rowIndex + i} - ${i} ${rowIndex}  ${count}`,
                contentPartner : `Partner ${rowIndex}`,
                contentPartner0: `Partner 0 ${rowIndex}`,
                contentPartner1: `Partner 1 ${rowIndex}`,
                contentPartner2: `Partner 2 ${rowIndex}`
            }
        }
        return ret;
    };

    it('should render a table', function () {

        into(<div style={{ height: 600, width: 600 }}><TableScroller
            height={500}
            rowHeight={50}
            rowData={rowData} rowCount={100} columns={columns}/></div>, true);
    });
    it('should render a small table', function () {

        into(<div style={{ height: 600, width: 600 }}><TableScroller
            height={500}
            rowHeight={50}
            rowData={rowData} rowCount={2} columns={columns}/></div>, true);
    });
    it.only('should render a virtualized small table', function () {

        into(<TableScroller
            width={'100vw'}
            rowHeight={50}
            virtualization={'Intersection'}
            isVirtualized={true}
            rowsVisible={1}
            rowData={rowData} rowCount={1   } columns={columns}/>, true);
    });
});
