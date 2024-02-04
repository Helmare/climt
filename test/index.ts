import { ClimtTable } from 'climt';
type Data = {
  a?: number|null;
  sub?: {
    b: number
  }
};

// Create table.
const table = new ClimtTable<Data>();

// Column bound to the a property
table.column('Alpha', 'a')
// Column bound to the sub.b property, with styling
table.column('Beta', 'sub.b', { align: 'right' })
// Column using a function for it's data.
table.column('Charlie', row => {
  if (row.a && row.sub && row.sub.b) {
    return (row.a + row.sub.b).toString();
  }
});

// Formats header.
table.format((ctx) => {
  if (ctx.row == -1) {
    return ctx.content.toUpperCase();
  }
  else {
    return ctx.content;
  }
});

// Renders table with the data.
table.render([
  { a: 5, sub: { b: 5 } },
  { a: -1, sub: { b: 10 } },
  { a: 10, sub: { b: 2 } },
  { a: 15, sub: { b: -6 } },
  { a: null, sub: { b: 10 } },
  { a: 20 }
]);