import { ClimtCell } from './cell.js';
import { DEFAULT_STYLE, ClimtBind, ClimtCloumnStyle, ClimtColumn } from './column.js';
import { getProp } from './utils.js';

/**
 * Builds and renders tables to the CLI.
 */
export class ClimtTable {
  cols: ClimtColumn[] = [];
  formatters: ClimtFormatter[] = [];

  /**
   * Adds a column to the table.
   * 
   * @param name 
   * @param bind 
   * @param [style]
   * @return {ClimtTable} returns `this` for chaining.
   */
  column(name: string, bind: ClimtBind, style?: ClimtCloumnStyle): ClimtTable {
    const col: ClimtColumn = {
      name: name,
      bind: bind,
      style: { ...DEFAULT_STYLE, ...style  },
      _width: 0
    }

    if (col.style.width <= 0) {
      col._width = col.style.maxWidth <= 0 ? col.name.length + 2 : Math.min(col.style.maxWidth, col.name.length + 2);
    }
    else {
      col._width = col.style.width;
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
   * @return returns `this` for chaining.
   */
  format(fmtr: ClimtFormatter): ClimtTable {
    this.formatters.push(fmtr);
    return this;
  }
  /**
   * @param content 
   * @returns
   */
  _format(content: string, col: number, row: number) {
    this.formatters.forEach(fmtr => {
      content = fmtr(content, col, row);
    });
    return content;
  }

  /**
   * Renders the data to the CLI using this table.
   * 
   * @param data 
   */
  render(data: any[]) {
    // Convert data into an array.
    if (!Array.isArray(data)) data = [data];

    const cells:ClimtCell[] = [];
    this.cols.forEach((col, x) => {
      // Add header column.
      cells.push(new ClimtCell(x, -1, col, col.name));

      // Add each row.
      data.forEach((row, y) => {
        // Get data object
        const obj = typeof(col.bind) === 'string' ? getProp(row, col.bind) : col.bind(row);

        // Grab content.
        let content = '';
        if (obj !== undefined && obj !== null) {
          content = obj.toString();
        }

        // Setup width
        if (col.style.width <= 0) {
          const width = Math.max(col._width, content.length + 2);
          col._width = col.style.maxWidth <= 0 ? width : Math.min(col.style.maxWidth, width);
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
        lines[y + i] += `|${this._format(line, cell.x, cell.y)}`;
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
export type ClimtFormatter = (content: string, col: number, row: number) => string;