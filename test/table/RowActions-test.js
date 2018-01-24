import React from 'react';
import RowActions from '../../src/table/RowActions';
import { into } from '../support';
import actions from '../../public/rowActions.json';
import { expect } from 'chai';
import '../../src/themes';
import 'hint.css/hint.css';


describe('RowActions', function () {
    this.timeout(50000);


    it('should render', function () {


        const menu = into(
            <div style={{
                width     : 300,
                position  : 'relative',
                background: 'gray',
                height    : 50
            }}><RowActions actions={actions}/>
            </div>, true);

        expect(menu).to.be.ok;

    });
    it('should render icons only', function () {


        const menu = into(<RowActions display={true} maxRowActions={2}
                                      actions={[
                                          {
                                              "action": "asterisk",
                                              "label" : "More Info",
                                              "icon"  : "insert_comment"
                                          },
                                          {
                                              "action": "video",
                                              "label" : "Watch Video",
                                              "icon"  : "live_tv"
                                          },
                                          {
                                              "action"  : "do something",
                                              "label"   : "Disabled Action",
                                              "icon"    : "explore",
                                              "disabled": true
                                          }]}/>, true);

        expect(menu).to.be.ok;

    });
    it('should render only menu', function () {


        const menu = into(<RowActions display={true} maxRowActions={2}
                                      actions={[
                                          {
                                              "action": "asterisk",
                                              "label" : "More Info",
                                          },
                                          {
                                              "action": "video",
                                              "label" : "Watch Video",
                                          },
                                          {
                                              "action"  : "do something",
                                              "label"   : "Disabled Action",
                                              "disabled": true
                                          }]}/>, true);

        expect(menu).to.be.ok;

    });
    it('should render smart if icons only menu', function () {


        const menu = into(<RowActions display={true} maxRowActions={2}
                                      actions={[
                                          {
                                              "action": "asterisk",
                                              "label" : "More Info",
                                              "icon"  : "phone"
                                          },
                                          {
                                              "action": "explore",
                                              "label" : "No Icon"
                                          },
                                          {
                                              "action": "video",
                                              "label" : "Watch Video",
                                          },
                                          {
                                              "action"  : "do something",
                                              "label"   : "Disabled Action",
                                              "icon"    : "insert_comment",
                                              "disabled": true
                                          }]}/>, true);

        expect(menu).to.be.ok;

    });
    it('should render smart if icons only menu and keep in view',
        function () {


            const menu = into(
                <div style={{
                    position     : 'absolute',
                    bottom       : 0,
                    display      : 'flex',
                    flexDirection: 'column',
                    width        : '100%',
                    height       : 300,
                    border       : '1px solid gray',
                    overflow     : 'hidden'
                }}>
                    {['one', 'two', 'three', 'four', 'five'].map(key => (
                        <RowActions key={key} display={true} maxRowActions={2}
                                    moreClassName={'hint--top'}
                                    actions={[
                                        {
                                            "action"   : "asterisk",
                                            "label"    : "More Info",
                                            "icon"     : "phone",
                                            "className": "hint--top"
                                        },
                                        {
                                            "action": "explore",
                                            "label" : "No Icon"
                                        },
                                        {
                                            "action": "video",
                                            "label" : "Watch Video",
                                        },
                                        {
                                            "action"   : "do something",
                                            "label"    : "Disabled Action",
                                            "icon"     : "insert_comment",
                                            "className": "hint--top",
                                            "disabled" : true
                                        }]}/>))}
                </div>

                , true);


            expect(menu).to.be.ok;

        });
    it('should render in a scroller', function () {


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

        expect(menu).to.be.ok;
    });
});
