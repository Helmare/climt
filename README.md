# **C**ommand **L**ine **I**nterface: **M**inimalist **T**ables
climt is a minimalist table renderer for CLI's with zero dependencies.


## Example
```js
const climt = require('climt');

// Create table.
const table = climt();

// Column bound to the a property
table.column('Alpha', 'a')
// Column bound to the sub.b property, with styling
table.column('Beta', 'sub.b', { align: 'right' })
// Column using a function for it's data.
table.column('Charlie', row => row.a + row.sub.b);

// Formats header.
table.format((content, col, row) => {
  if (row == -1) {
    return content.toUpperCase();
  }
  else {
    return content;
  }
});

// Renders table with the data.
table.render([
  { a: 5, sub: { b: 5 } },
  { a: -1, sub: { b: 10 } },
  { a: 10, sub: { b: 2 } },
  { a: 15, sub: { b: -6 } },
]);
```

### Outputs
```
 ALPHA | BETA | CHARLIE 
-------+------+---------
 5     |    5 | 10
 -1    |   10 | 9
 10    |    2 | 12
 15    |   -6 | 9
```