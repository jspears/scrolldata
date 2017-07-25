import React from 'react';
import expect from "expect";
import RowActions from '../../src/table/RowActions';
import { into } from '../support';
import { themeClass } from '../../src';
import appTc from '../../public/tc';

const cell = themeClass({ displayName: 'Cell' });
const row  = themeClass({ displayName: 'Row' });
const col  = themeClass({ displayName: 'Column' })

describe('RowActions', function () {
    this.timeout(50000);
    const actions = [{
        action: 'asterisk',
        label : 'More Info',
        icon  : 'glyphicon glyphicon-asterisk',
    }, {
        action: 'video',
        label : 'Watch Video',
        icon  : 'glyphicon glyphicon-facetime-video',

    }, {
        action: 'download',
        label : 'Download',
        icon  : 'glyphicon glyphicon-cloud-download',
    }, {
        action: 'Do something',
        label : 'Action',
    }, {
        action: "movee",
        label : "Move"
    }, {
        icon  : 'glyphicon glyphicon-remove',
        action: "delete",
        label : "Delete..."
    }
    ];

    it('should render', function () {


        const menu = into(
            <div style={{
                width     : 300,
                position  : 'relative',
                background: 'gray',
                height    : 50
            }}><RowActions actions={actions}/>
            </div>, true);

        expect(menu).toExist();

    });
    it.only('should render in a scroller', function () {


        const menu = into(
            <div style={{ width: 600, overflow: 'auto' }} className='parent'>
                <div style={{
                    width     : 1200,
                    position  : 'relative',
                    background: 'gray',
                    height    : 50
                }}>
                </div>
                <div style={{
                    width     : 1200,
                    position  : 'relative',
                    background: 'gray',
                    height    : 50
                }}>
                    <RowActions actions={actions} containerWidth={600}/>
                </div>
                <div style={{
                    width     : 1200,
                    position  : 'relative',
                    background: 'gray',
                    height    : 50
                }}>
                </div>
            </div>, true);

        expect(menu).toExist();

    });
});
