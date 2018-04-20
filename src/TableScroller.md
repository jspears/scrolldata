Simple usage for TableScroller



Virtualized by intersection.

```js
const example = require('../public/companies.clean.json');
const {makeCompare, reverse, rowDataFactory} = require('./util');
const columns = require('../public/columns.json');
//This is just to show async loading.
const wait = (to,...a) => new Promise(r=>setTimeout(r, to, ...a));

const  rowDataImpl  = rowDataFactory(example);

const rowData = (...args)=>wait(100, rowDataImpl(...args));

<TableScroller rowsVisible={5} rowHeight={50}
               virtualization='intersection'
               rowCount={200} rowData={rowData} columns={columns}/>
```

Virtualized using traditional virtualized.

```js
const example = require('../public/companies.clean.json');
const {makeCompare} = require('./util');
const columns = require('../public/columns.json');
//This is just to show async loading.
const fake = (to,...a)=>new Promise(r=>setTimeout(r, to, ...a));

const    rowData         = (offset, count, { sortColumn, sortDirection } = {}) => {
              let ret;
              if (sortColumn && sortDirection) {
                  let {
                          columnKey,
                          sorter,
                          formatter,
                      } = sortColumn;

                  let data = example.concat();
                  if (typeof sorter !== 'function') {
                      sorter = makeCompare(formatter, columnKey, sortColumn);
                  }
                  data.sort(sortDirection === 'DESC' ? reverse(sorter) : sorter);
                  ret = data.slice(offset, offset + count);
              } else {
                  ret = example.slice(offset, offset + count);
              }
              return fake(100, ret);
          };


<TableScroller rowsVisible={5} rowHeight={50}
               virtualization='virtualized'
               rowCount={200}
               rowData={rowData}
               columns={columns}/>
```
