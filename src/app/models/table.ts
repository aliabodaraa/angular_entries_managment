import { EntryType } from './app_data_state';
export interface State {
  pageIndex: number;
  pageSize: number;
  totalSize: number;
  numberOfPages?: number;
}
export type ModeOperationType = 'show' | 'edit' | 'delete';
export type OpertionEmitterType = {
  entry: EntryType;
  mode: ModeOperationType;
};
export type PageRequestParams = {
  pageIndex?: number;
  pageSize?: number;
  currentPageIndex?: number;
  numberOfPages?: number;
  properties: '*';
};
// "totalSize": 4,
// "pageIndex": 0,
// "numberOfPages": 1,
