import { ClimtCell } from './cell.js';
import { DEFAULT_STYLE, ClimtBind, ClimtCloumnStyle, ClimtColumn, ClimtBindContext } from './column.js';
import { getProp } from './utils.js';

/**
 * Builds and renders tables to the CLI.
 */
export class ClimtTable<T> {
  cols: ClimtColumn<T>[] = [];
  formatters: ClimtFormatter<T>[] = [];

  /**
   * Adds a column to the table.
   * 
   * @param name 
   * @param bind 
   * @param style
   * @return `this` for chaining.
   */
  column(name: string, bind: ClimtBind<T>, style?: ClimtCloumnStyle): ClimtTable<T> {
    const col: ClimtColumn<T> = {
      name: name,
      bind: bind,
      style: { ...DEFAULT_STYLE, ...style  },
      _width: 0
    }

    if (col.style.width! <= 0) {
      col._width = col.style.maxWidth! <= 0 ? col.name.length + 2 : Math.min(col.style.maxWidth!, col.name.length + 2);
    }
    else {
      col._width = col.style.width!;
    }

    this.cols.push(col);
    return this;
  }
  /**
   * @return number of columns
   */
  get count(): number {
    return this.cols.length;
  }

  /**
   * Adds a formatter for use in rendering.
   * 
   * @param fmtr
   * @return `this` for chaining.
   */
  format(fmtr: ClimtFormatter<T>): ClimtTable<T> {
    this.formatters.push(fmtr);
    return this;
  }
  /**
   * @param content 
   * @returns
   */
  _format(ctx: ClimtFormatContext<T>): string {
    this.formatters.forEach(fmtr => {
      ctx.content = fmtr(ctx);
    });
    return ctx.content;
  }

  /**
   * Renders the data to the CLI using this table.
   * 
   * @param data 
   */
  render(dat: T|T[]) {
    // Convert data into an array.
    const data = Array.isArray(dat) ? dat : [dat];

    const cells: ClimtCell<T>[] = [];
    const bindCtx: ClimtBindContext<T> = {
      table: this,
      data: data,
      row: -1
    };
    this.cols.forEach((col, x) => {
      // Add header column.
      cells.push(new ClimtCell(x, -1, col, col.name));

      // Add each row.
      data.forEach((row, y) => {
        // Get data object
        bindCtx.obj = row;
        bindCtx.row = y;
        const obj = typeof(col.bind) === 'string' ? getProp(row, col.bind) : col.bind(bindCtx);

        // Grab content.
        let content = '';
        if (obj !== undefined && obj !== null) {
          content = obj.toString();
        }

        // Setup width
        if (col.style.width! <= 0) {
          const width = Math.max(col._width, content.length + 2);
          col._width = col.style.maxWidth! <= 0 ? width : Math.min(col.style.maxWidth!, width);
        }

        // Push content cell.
        cells.push(new ClimtCell(x, y, col, content));
      });
    });

    // Evaluate cells after cells have been added.
    cells.forEach(cell => cell._eval());

    // Sort cells to be in an order easy for rendering.
    cells.sort((a, b) => {
      const ai = a.x + a.y * this.count;
      const bi = b.x + b.y * this.count;
      return ai - bi;
    });

    // Expand row heights to be even.
    cells.forEach((cell, i) => {
      const sor = this.count * Math.floor(i / this.count);
      const eor = sor + this.count;
      for (let j = sor; j < eor; j++) {
        if (j != i) {
          cell.expand(cells[j].height);
        }
      }
    });

    // Prerender
    const ctx: ClimtFormatContext<T> = {
      table: this,
      data: data,
      col: -1,
      row: -1,
      content: ''
    };
    const lines: string[] = [];
    const rowy: number[] = [];
    cells.forEach(cell => {
      // Setup lines and rowy if needed.
      const y = (rowy[cell.y] | 0);
      while (lines.length < y + cell.height) {
        lines.push('');
      }
      rowy[cell.y + 1] = y + cell.height;

      // Incorporate data
      cell._lines.forEach((line, i) => {
        ctx.col = cell.x;
        ctx.row = cell.y;
        ctx.content = line,
        lines[y + i] += `|${this._format(ctx)}`;
      });
    });

    // Add header seperator.
    let sep = '';
    this.cols.forEach(col => {
      sep += `+${''.padStart(col._width, '-')}`;
    });
    lines.splice(cells[0].height, 0, sep);

    // Render
    console.log();
    lines.forEach(line => console.log(line.substring(1)));
    console.log();
  }
}
export type ClimtFormatContext<T> = {
  table: ClimtTable<T>;
  data: T[];

  col: number;
  row: number;
  content: string;
}
export type ClimtFormatter<T> = (ctx: ClimtFormatContext<T>) => string;