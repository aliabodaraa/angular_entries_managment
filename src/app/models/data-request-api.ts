export enum ProviderPageEnum {
  PP_Organizar = 'PP_Organizar',
  PP_Activity = 'PP_Activity',
}
export enum ProviderTypeEnum {
  Activity = 'Activity',
  Organizer = 'Organizer',
}
export type PageRequestParams = {
  pageIndex?: number;
  pageSize?: number;
  currentPageIndex?: number;
  numberOfPages?: number;
  properties: '*';
};

export type EntryType = {
  uid: string;
  title: string;
  website: string;
  creation_data: string;
  modified_date: string;
  creator: string;
};
