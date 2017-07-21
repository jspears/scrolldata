import React from 'react';
import expect from "expect";
import TableScroller from '../../src/table/TableScroller';
import { into } from '../support';


describe('Table', function () {
    this.timeout(50000);

    const rowData      = (rowIndex, count) => {
        const ret = Array(count);
        for (let i = 0; i < count; i++) {
            ret[i] = {
                status         : i % 2,
                requestId      : `${rowIndex + i} - ${i} ${rowIndex}  ${count}`,
                contentPartner : `Partner ${rowIndex}`,
                contentPartner0: `Partner 0 ${rowIndex}`,
                contentPartner1: `Partner 1 ${rowIndex}`,
                contentPartner2: `Partner 2 ${rowIndex}`
            }
        }
        return ret;
    };
    const statusRender = ({ rowIndex, width, height }) => {
        return <div
            style={{
                width,
                height,
                background: (rowIndex % 2 ? 'red' : 'green')
            }}/>
    };
    it('should render a table', function () {

        into(<div style={{ height: 600, width: 600 }}><TableScroller
            height={500}
            rowHeight={50}
            rowData={rowData} rowCount={100} columns={[
            {
                columnKey          : 'status',
                cellHeaderClassName: 'TableScroller__status',
                label              : '',
                width              : 5,
                sortable           : false,
                resizable          : false,
                formatter          : statusRender

            },
            {
                columnKey: 'requestId',
                label    : 'Request',
                width    : 200,
                sortable : true,
                resizable: true,
            },
            {
                columnKey: 'contentPartner',
                label    : 'Content Partner',
                width    : 200,
                sortable : true,
            },
            {
                columnKey: 'contentPartner0',
                label    : 'Content 0 Partner',
                width    : 200,
                sortable : true,
            },
            {
                columnKey: 'contentPartner1',
                label    : 'Content 1 Partner',
                width    : 200,
                sortable : true,
            },
            {
                columnKey: 'contentPartner2',
                label    : 'Content 2 Partner2',
                width    : 200,
                sortable : true,
            }]

        }/></div>, true);
    });
});
