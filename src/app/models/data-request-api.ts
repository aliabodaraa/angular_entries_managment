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
  uid: string; //uid
  name: string; //organizer:name
  website: string; //organizer:website
  creation_data: string; //dc:created
  modified_date: string; //dc:modified
  creator: string; //dc:creator
  addresses: { address: string; label: string }[]; //organizer:addresses
  emails: { emailAddress: string; label: string }[]; //organizer:emails
  organizationActivity: string; //organizer:organizationActivity
  phones: { phoneNumber: string; label: string }[]; //organizer:phones
};
