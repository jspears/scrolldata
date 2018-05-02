It is yet another virtual scroller, with a few advantages. I did not want to
write this component but all the components I tested missed something I needed.

I looked at
 * reactvirtualized - did not have resizable columns, or expandable content
 * fixed-data-tables - expandable content did not work, and a million extra nodes.
 * smarttable - some internal thing that works ok, but totally featureless.
 * a couple of others, but they all had fatal flaws (table based layout, too many nodes, not configuration driven, etc...)


Advantages:
  * Very few additonal dom nodes.
  * Very few reflows and unnessary virtual tree updates.
  * can scrollTo row
  * does not ref any data not being shown.
  * table is sortable
  * expandable
  * columns are resizable
  * configuration based.
  * Row level actions.
  * Row level Menu.
  * Custom renderers for rows, cells, columns,etc.



## Demo
See it in action [demo](./demo/index.html)

Or run it 

```sh
  $ git clone
  $ cd scrolldata
  $ yarn install
  $ yarn start
```
Open your browser to [http://localhost:8082](http://localhost:8082)

## Installation
```sh
 $ yarn add scrolldata
```
