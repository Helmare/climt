import { ClimtTable } from "./table.js";

export const DEFAULT_STYLE: ClimtCloumnStyle = {
  width: 0,
  maxWidth: 0,
  overflow: 'wrap',
  align: 'left'
};

export type ClimtColumn<T> = {
  /** Binds data to each row using an ID string or a funciton. */
  bind: ClimtBind<T>
  /** Display name of the column (ID by default). */
  name: string;
  /** Width of the column (may be different from `style.width`). *Should not be set by humans.* */
  _width: number;
  /** Styling for the column. */
  style: ClimtCloumnStyle;
}
export type ClimtCloumnStyle = {
  /** Width of the column. */
  width?: number;
  /** Max width of the column. Ignored if `style.width` is set. `<= 0` values allow infinite width. */
  maxWidth?: number;
  /** Determains what to do with overflow. */
  overflow?: 'wrap'|'truncate'
  /** Text alignment. */
  align?: 'left'|'right'|'center';
}
/**
 * Binds a columns content to a function or property.
 */
export type ClimtBind<T> = ((ctx: ClimtBindContext<T>) => any|null|undefined)|string;
export type ClimtBindContext<T> = {
  table: ClimtTable<T>;
  data: T[];
  obj?: T;
  row: number;
}