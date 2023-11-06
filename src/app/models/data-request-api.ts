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
type LocationType = { city: string; geographicLocation: string };
export interface EntryType {
  uid: string; //uid
  'dc:created': string; //dc:created
  'dc:modified': string; //dc:modified
  'dc:creator': string; //dc:creator
}
export interface OrganizeEntry extends EntryType {
  'organizer:name': string; //organizer:name
  'organizer:website': string; //organizer:website
  'dc:created': string; //dc:created
  'dc:modified': string; //dc:modified
  'dc:creator': string; //dc:creator
  'organizer:addresses': { address: string; label: string }[]; //organizer:addresses
  'organizer:emails': { emailAddress: string; label: string }[]; //organizer:emails
  'organizer:organizationActivity': string; //organizer:organizationActivity
  'organizer:phones': { phoneNumber: string; label: string }[]; //organizer:phones
}
export interface ActivityEntry extends EntryType {
  'dc:title': string;
  'dc:description': string;
  'activity:categorization': string;
  'activity:organizers': string[];
  'activity:locations': LocationType;
  'activity:startDate': string;
  'activity:endDate': string;
  'activity:timeFrom': string;
  'activity:timeTo': string;
  'activity:coverPicture': string;
}
export function isActivityEntry(
  pet: ActivityEntry[] | OrganizeEntry[]
): pet is ActivityEntry[] {
  return (pet as ActivityEntry[])[0]['dc:description'] !== undefined;
}
