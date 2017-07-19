Scrolldata
===
It is yet another virtual scroller, with a few advantages.
* Very few additonal dom nodes.
* Rows are not wrapped.
* Does not store data, other than what is in display.
* Has in place holders.
* Elements can use natural positioning, when rendered.





##Demo
See it in action [here](https://jspears.github.io/scrolldata)

Or run it 

```sh
  git clone 
  cd scrolldata
  npm install
  npm run server &
  open http://localhost:8082
```

##Installation
```sh
 $ npm install scrolldata
``

##Usage
```jsx

 import React, { Component, PureComponent } from 'react';
 import example from './exampleDataset.json';

 import Scroller from 'scrolldata';
 import style from './App.stylm';

 const Render = ({ rowIndex, rowHeight, data: { requestId, contentPartnerId, fulfillmentPartner, movieId }, }) => {

     return <div className={style.row} style={{ height: rowHeight }}>
         <div className={`${style.cell} ${style.index}`}>{rowIndex}</div>
         <div className={style.cell}>{requestId}</div>
         <div className={style.cell}>{contentPartnerId}</div>
         <div className={style.cell}>{fulfillmentPartner}</div>
         <div className={style.cell}>{movieId}</div>
     </div>
 };

 const Blank = ({ rowHeight }) => {
     return <div className={style.row} style={{ height: rowHeight }}>
         <div className={`${style.blank} ${style.index}`}>&nbsp;</div>
         <div className={style.blank}>&nbsp;</div>
         <div className={style.blank}>&nbsp;</div>
         <div className={style.blank}>&nbsp;</div>
         <div className={style.blank}>&nbsp;</div>
     </div>
 };

 function toString(val) {
     if (typeof val === 'function') {
         return val.name;
     }
     return String(val);
 }

 const Slider = ({ label, type = 'range', min = 0, value, name, ...rest }) => {
     return (<div className='form-group'>
         <label htmlFor={name}>{label} ({toString(value[name])})</label>
         <input type={type}
                className='form-control'
                id={name}
                name={name}
                min={min}
                value={value[name]}
                {...rest}/>
     </div>)
 };

 const wait = (timeout, value) => new Promise(
     r => setTimeout(r, timeout * 1000, value));

 class ExampleState extends Component {
     state = {
         scrollTo  : 0,
         rowHeight : 50,
         height    : 600,
         rowCount  : example.length,
         renderItem: Render,
         fakeFetch : 1
     };

     handleNumChange = ({ target: { value, name } }) =>
         this.setState({ [name]: parseInt(value, 10) });

     rowData = (rowIndex, count = 1) => {
         console.log(`rowData`, rowIndex, count);
         const { fakeFetch } = this.state;

         const data = example.slice(rowIndex, rowIndex + count);
         return wait(fakeFetch, data);

     };

     handleScrollTo   = (scrollTo) => {
         this.setState({ scrollTo });
     };
     handleRenderItem = ({ target: { checked, name } }) => {
         this.setState({ [name]: checked ? Render : Blank });
     };

     render() {
         //don't pass in fakeFetch
         const { fakeFetch, ...props } = this.state;
         return <form className='inline-form'>
             <Slider name='scrollTo' label='Scroll To' value={this.state}
                     max={this.state.rowCount}
                     onChange={this.handleNumChange}/>
             <Slider name='rowHeight' label='Row Height' value={this.state}
                     max={600}
                     onChange={this.handleNumChange}/>
             <Slider name='rowCount' label='Row Count' value={this.state}
                     max={example.length}
                     onChange={this.handleNumChange}/>
             <Slider name='height' label='Height' value={this.state}
                     max={1600}
                     onChange={this.handleNumChange}/>
             <Slider name='renderItem'
                     type='checkbox'
                     label='Change Render'
                     checked={this.state.renderItem === Render}
                     value={this.state}
                     onChange={this.handleRenderItem}
             />
             <Slider name='fakeFetch'
                     label='Time to delay fetch (s)'
                     checked={this.state.renderItem === Render}
                     value={this.state}
                     min={0}
                     max={10}
                     onChange={this.handleNumChange}
             />
             <h1>Virtualized</h1>
             <Scroller renderItem={Render}
                       renderBlank={Blank}
                       rowData={this.rowData}
                       onScrollToChanged={this.handleScrollTo}
                       {...props}/>
         </form>
     }
 }

 export default class App extends PureComponent {
     render() {
         return <div>
             <h3>Scrolldata</h3>
             <p>This is a little example to show how it would work</p>
             <ExampleState/>
         </div>
     }
 }


  
```
