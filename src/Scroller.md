This is basic usage of scroller.   Scroller just does scrolling.
Use TableScroller for a table.  It provides little to no styling.
## Usage

```jsx

 const example = require('../public/companies.clean.json');

 const Render = ({ rowIndex, rowHeight, data: { _id, name }, }) => {

     return <div style={{ height: rowHeight,     display: 'flex',
                                                 flexDirection: 'row',
                                                 flex: 1,
                                                 width: '100%',
                                                 justifyContent: 'space-between',
                                                 borderBottom:'1px solid #ccc'
                                                  }}>
         <div>{rowIndex}</div>
         <div >{_id}</div>
         <div>{name}</div>

     </div>
 };

 const Blank = ({ rowHeight }) => {
     return <div className={style.row} style={{ height: rowHeight }}>
         <div>&nbsp;</div>
         <div>&nbsp;</div>
         <div>&nbsp;</div>
     </div>
 };

 const wait = (to, ...a) => new Promise(r => setTimeout(r, to * 1000, ...a));

const rowData = (rowIndex, count = 1) => {

         const data = example.slice(rowIndex, rowIndex + count);
         console.log(`rowData`, rowIndex, count, data);

         return wait(1, data);

};

<Scroller renderItem={Render}
          rowCount={100}
          height={200}
          rowHeight={50}
          renderBlank={Blank}
          virtualization='virtualized'
          rowData={rowData} />
```
