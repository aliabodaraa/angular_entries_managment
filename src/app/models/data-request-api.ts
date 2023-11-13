import { ActivityDataModeEdition } from '../services/dataHttp.service';

export enum ProviderPageEnum {
  PP_Organizar = 'PP_Organizar',
  PP_Activity = 'PP_Activity',
}
export enum ProviderTypeEnum {
  Activity = 'Activity',
  Organizer = 'Organizer',
}
export enum PageTypeEnum {
  New = 'New',
  Edit = 'Edit',
}
//Operations Section
export enum CreationIdentifiersEnum {
  Organizer = 'AC_UA_Organizer_Create',
  Activity = 'AC_UA_Activity_Create',
}
export enum EditionIdentifiersEnum {
  Organizer = 'AC_UA_Organizer_Update',
  Activity = 'Document.Update', // Activity = 'AC_UA_Activity_Update',
}
export enum DeletionIdentifiersEnum {
  Organizer = 'AC_UA_Organizer_Delete',
  Activity = 'AC_UA_Activity_Delete',
}
export function isActivityDataModeEdition(
  entry: ActivityDataModeEdition
): entry is ActivityDataModeEdition {
  return (entry as ActivityDataModeEdition)['properties'] !== undefined;
}
