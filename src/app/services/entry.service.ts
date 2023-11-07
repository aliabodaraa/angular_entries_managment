import { Inject, Injectable } from '@angular/core';
import {
  ActivityEntry,
  DeletionIdentifiersEnum,
  EntryType,
  OrganizeEntry,
  PageRequestParams,
  PageTypeEnum,
  ProviderPageEnum,
  ProviderTypeEnum,
} from '../models/data-request-api';
import { DataHttpService } from './dataHttp.service';
@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private dataHttpService: DataHttpService) {}

  public getEntries(providerType: ProviderTypeEnum, params: PageRequestParams) {
    let pageProvider =
      providerType === ProviderTypeEnum.Organizer
        ? ProviderPageEnum.PP_Organizar
        : ProviderPageEnum.PP_Activity;

    return this.dataHttpService.getData(pageProvider, params);
  }
  public saveUpdateEntry(
    formValue: Partial<EntryType>,
    pageType: PageTypeEnum,
    u_id?: string
  ) {
    if (pageType === PageTypeEnum.New) {
      return this.dataHttpService.createEntry(formValue);
    }
    return this.dataHttpService.updateEntry(formValue, u_id!);
  }
  public deleteEntry(providerType: ProviderTypeEnum, entry: EntryType) {
    let deletion_identifier =
      providerType === ProviderTypeEnum.Organizer
        ? DeletionIdentifiersEnum.Organizer
        : DeletionIdentifiersEnum.Activity;
    console.log(entry);
    return this.dataHttpService.deleteEntry(entry.uid, deletion_identifier);
  }

  //storage
  public getEntryInfo() {
    let entry = JSON.parse(localStorage.getItem('entry')!);
    let pageType = localStorage.getItem('pageType') || PageTypeEnum.New;
    let providerType =
      localStorage.getItem('providerType') || ProviderTypeEnum.Organizer;
    return [entry, pageType, providerType] as [
      OrganizeEntry | ActivityEntry,
      PageTypeEnum,
      ProviderTypeEnum
    ];
  }
  public storgeEntryInfo(providerType: ProviderTypeEnum, entry: EntryType) {
    localStorage.setItem('entry', JSON.stringify(entry));
    localStorage.setItem('pageType', JSON.stringify(PageTypeEnum.Edit));
    localStorage.setItem(
      'providerType',
      JSON.stringify(
        providerType === ProviderTypeEnum.Organizer
          ? ProviderTypeEnum.Organizer
          : ProviderTypeEnum.Activity
      )
    );
  }
  public mapPureDataToEntries(
    providerType: ProviderTypeEnum,
    pure_response: any
  ) {
    let entries: ActivityEntry[] | OrganizeEntry[] = [];
    if (providerType === ProviderTypeEnum.Organizer)
      entries = pure_response.entries.map((e: any) => ({
        uid: e.uid,
        'dc:created': e.properties['dc:created'],
        'dc:modified': e.properties['dc:modified'],
        'dc:creator': e.properties['dc:creator'],
        'organizer:name': e.properties['organizer:name'],
        'organizer:website': e.properties['organizer:website'],
        'organizer:emails': e.properties['organizer:emails'],
        'organizer:addresses': e.properties['organizer:addresses'],
        'organizer:organizationActivity':
          e.properties['organizer:organizationActivity'],
        'organizer:phones': e.properties['organizer:phones'],
      }));
    else
      entries = pure_response.entries.map((e: any) => ({
        uid: e.uid,
        'dc:created': e.properties['dc:created'],
        'dc:modified': e.properties['dc:modified'],
        'dc:creator': e.properties['dc:creator'],
        'dc:title': e.properties['dc:title'],
        'dc:description': e.properties['dc:description'],
        'activity:organizers': e.properties['activity:organizers'],
        'activity:locations': e.properties['activity:locations'],
        'activity:startDate': e.properties['activity:startDate'],
        'activity:endDate': e.properties['activity:endDate'],
        'activity:timeFrom': e.properties['activity:timeFrom'],
        'activity:timeTo': e.properties['activity:timeTo'],
      }));
    return entries;
  }
  entryPropertiesAllowedToAppearInTable(providerType: ProviderTypeEnum) {
    console.log(providerType);
    let coulumns = [
      'dc:title',
      'dc:creator',
      'dc:description',
      'dc:created',
      'dc:modified',
    ];
    if (providerType === ProviderTypeEnum.Organizer) {
      coulumns = [
        'organizer:name',
        'dc:creator',
        'organizer:website',
        'dc:created',
        'dc:modified',
      ];
    }
    return coulumns;
  }
}
