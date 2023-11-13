import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import {
  ActivityDataModeCreation,
  ActivityDataModeEdition,
  DataHttpService,
} from './dataHttp.service';
import {
  CreationIdentifiersEnum,
  DeletionIdentifiersEnum,
  EditionIdentifiersEnum,
  ProviderPageEnum,
} from '../models/data-request-api';
import { ActivityEntry, EntryType } from '../models/app_data_state';
import { PageRequestParams } from '../models/table';
@Injectable({
  providedIn: 'root',
})
export class ActivityService extends BaseService<ActivityEntry> {
  constructor(private dataHttpService: DataHttpService) {
    super();
  }
  public getEntries(params: PageRequestParams = { properties: '*' }) {
    return this.dataHttpService.getData(ProviderPageEnum.PP_Activity, params);
  }

  public saveEntry(formValue: ActivityEntry) {
    let creationIdentifier = CreationIdentifiersEnum.Activity;
    let data_form: ActivityDataModeCreation = {
      activity: formValue,
    };
    return this.dataHttpService.createEntry(
      creationIdentifier as CreationIdentifiersEnum,
      data_form as ActivityDataModeCreation
    );
  }

  public editEntry(formValue: ActivityEntry, u_id: string) {
    let editionIdentifier = EditionIdentifiersEnum.Activity;
    let data_form: ActivityDataModeEdition = { properties: formValue };
    return this.dataHttpService.updateEntry(
      editionIdentifier as EditionIdentifiersEnum,
      data_form as ActivityDataModeEdition,
      u_id
    );
  }

  public deleteEntry(entry: EntryType) {
    let deletion_identifier = DeletionIdentifiersEnum.Activity;
    console.log(entry);
    return this.dataHttpService.deleteEntry(entry.uid, deletion_identifier);
  }
}
