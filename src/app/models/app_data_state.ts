//State Section
type LocationType = { city: string; geographicLocation: string };
type EmailType = { emailAddress: string; label: string };
type AddressType = { address: string; label: string };
type PhoneType = { phoneNumber: string; label: string };
type CoverPictureType = {
  'upload-batch': string;
  'upload-fileId': string;
};
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
  'organizer:addresses': AddressType[]; //organizer:addresses
  'organizer:emails': EmailType[]; //organizer:emails
  'organizer:organizationActivity': string; //organizer:organizationActivity
  'organizer:phones': PhoneType[]; //organizer:phones
}
export interface ActivityEntry extends EntryType {
  'dc:title': string;
  'dc:description': string;
  'activity:categorization': string;
  'activity:organizers': string;
  'activity:locations': LocationType;
  'activity:startDate': string;
  'activity:endDate': string;
  'activity:timeFrom': string;
  'activity:timeTo': string;
  'activity:coverPicture': CoverPictureType;
}
export function isActivityEntry(entry: EntryType): entry is ActivityEntry {
  return (entry as ActivityEntry)['dc:description'] !== undefined;
}
export function isOrganizerEntry(entry: EntryType): entry is OrganizeEntry {
  return (entry as OrganizeEntry)['organizer:website'] !== undefined;
}
