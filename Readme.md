Scrolldata
===
It is yet another virtual scroller, with a few advantages. I did not want to
write this component but all the components I tested missed something I needed.

I looked at
 * reactvirtualized - did not have resizable columns, or expandable content
 * fixed-data-tables - expandable content did not work, and a million extra nodes.
 * smarttable - some internal thing that works ok, but totally featureless.
 * a couple of others, but they all had fatal flaws (table based layout,


* Very few additonal dom nodes.
* Very few reflows and unnessary virtual tree updates.
  * can scrollTo row
  * does not ref any data not being shown.
* Has a table
  * table is sortable
  * expandable
  * columns are resizable
  * configurable
  * Row level actions


## Todo -
  - Write real docs.



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

 const wait = (timeout, value) => new Promise(
     r => setTimeout(r, timeout * 1000, value));

 class ExampleState extends Component {
     state = {
         scrollTo  : 0,
         rowHeight : 50,
         height    : 600,
         rowCount  : example.length,
         renderItem: Render
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
         return <Scroller renderItem={Render}
                       renderBlank={Blank}
                       rowData={this.rowData}
                       onScrollToChanged={this.handleScrollTo}
                       {...props}/>
     }
 }


  
```
