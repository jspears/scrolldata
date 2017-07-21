import React from 'react';
import expect from "expect";
import IndeterminateCheckbox from '../../src/table/IndeterminateCheckbox';
import { into } from '../support';


describe('Checkbox', function () {
    this.timeout(50000);

    class StateWrap extends React.PureComponent {

        state = {
            state: 'unchecked'

        };

        handleClick = (e) => {
            let state = '';
            switch (this.state.state) {
                case 'unchecked':
                    state = 'indeterminate';
                    break;
                case 'indeterminate':
                    state = 'checked';
                    break;
                case 'checked':
                    state = 'unchecked';
                    break
            }
            this.setState({ state });
        };

        render() {
            return <IndeterminateCheckbox onSelect={this.handleClick}
                                          state={this.state.state}/>
        }
    }
    it('should render a IndeterminateCheckbox state', function () {

        into(<StateWrap/>, true);
    });
    it('should render a IndeterminateCheckbox default', function () {

        into(<IndeterminateCheckbox/>, true);
    });

    it('should render a IndeterminateCheckbox checked', function () {

        into(<IndeterminateCheckbox state='checked'/>, true);
    });

    it('should render a IndeterminateCheckbox unchecked', function () {

        into(<IndeterminateCheckbox state='unchecked'/>, true);
    });

    it('should render a IndeterminateCheckbox indeterminate', function () {

        into(<IndeterminateCheckbox state='INDETERMINATE'/>, true);
    });
});
