import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { DataHttpService, OrganizerDataMode } from './dataHttp.service';
import {
  CreationIdentifiersEnum,
  DeletionIdentifiersEnum,
  EditionIdentifiersEnum,
  ProviderPageEnum,
} from '../models/data-request-api';
import { EntryType, OrganizeEntry } from '../models/app_data_state';
import { PageRequestParams } from '../models/table';

@Injectable({
  providedIn: 'root',
})
export class OrganizerService extends BaseService<OrganizeEntry> {
  constructor(private dataHttpService: DataHttpService) {
    super();
  }
  public getEntries(params: PageRequestParams = { properties: '*' }) {
    return this.dataHttpService.getData(ProviderPageEnum.PP_Organizar, params);
  }

  public saveEntry(formValue: Partial<OrganizeEntry>) {
    let creationIdentifier = CreationIdentifiersEnum.Organizer;
    let data_form: OrganizerDataMode = formValue;
    return this.dataHttpService.createEntry(creationIdentifier, data_form);
  }

  public editEntry(formValue: Partial<OrganizeEntry>, u_id: string) {
    let editionIdentifier = EditionIdentifiersEnum.Organizer;
    let data_form: OrganizerDataMode = formValue;
    return this.dataHttpService.updateEntry(editionIdentifier, data_form, u_id);
  }
  public deleteEntry(entry: EntryType) {
    let deletion_identifier = DeletionIdentifiersEnum.Organizer;
    console.log(entry);
    return this.dataHttpService.deleteEntry(entry.uid, deletion_identifier);
  }
}
