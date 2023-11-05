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
export enum CreationIdentifiersEnum {
  Organizer = 'AC_UA_Organizer_Create',
  Activity = 'AC_UA_Activity_Create',
}
export type EntryType = {
  uid: string; //uid
  'organizer:name': string; //organizer:name
  'organizer:website': string; //organizer:website
  'dc:created': string; //dc:created
  'dc:modified': string; //dc:modified
  'dc:creator': string; //dc:creator
  'organizer:addresses': { address: string; label: string }[]; //organizer:addresses
  'organizer:emails': { emailAddress: string; label: string }[]; //organizer:emails
  'organizer:organizationActivity': string; //organizer:organizationActivity
  'organizer:phones': { phoneNumber: string; label: string }[]; //organizer:phones
};
