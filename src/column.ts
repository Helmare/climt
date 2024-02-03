export interface ClimtColumn {
  /** Binds data to each row using an ID string or a funciton. */
  bind: ClimtBind
  /** Display name of the column (ID by default). */
  name: string;
  /** Width of the column (may be different from `style.width`). *Should not be set by humans.* */
  _width: number;
  /** Styling for the column. */
  style: ClimtCloumnStyle;
}
export interface ClimtCloumnStyle {
  /** Width of the column. */
  width: number;
  /** Max width of the column. Ignored if `style.width` is set. `<= 0` values allow infinite width. */
  maxWidth: number;
  /** Determains what to do with overflow. */
  overflow: 'wrap'|'truncate'
  /** Text alignment. */
  align: 'left'|'right'|'center';
}
export type ClimtBind = ((obj: any) => string)|string;
export type ClimtFormatter = (content: string, col: number, row: number) => string;