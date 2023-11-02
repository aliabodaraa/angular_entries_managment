import { Organizer } from '../models/organizer';
import { Activity } from '../models/activity';
export enum PageProviderEnum {
  PP_Organizar = 'PP_Organizar',
  PP_Activity = 'PP_Activity',
}
export type PageRequestParams = {
  pageIndex?: number;
  pageSize?: number;
  currentPageIndex?: number;
  numberOfPages?: number;
  properties: '*';
};
export type PageResponse = {
  pageCount: number;
  // pageSize: number;
  // pageIndex: number;
  entries: EntryType[];
};
export type EntryType = {
  uid: string;
  title: string;
  website: string;
  creation_data: string;
  modified_date: string;
  creator: string;
};
