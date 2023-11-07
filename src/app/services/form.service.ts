import { Inject, Injectable } from '@angular/core';
import { FormArray, ValidatorFn, Validators } from '@angular/forms';
import {
  ActivityEntry,
  EntryType,
  OrganizeEntry,
  PageTypeEnum,
  ProviderTypeEnum,
  isActivityEntry,
} from '../models/data-request-api';
import { DataHttpService } from './dataHttp.service';
import { of } from 'rxjs';
type FormArrayType = {
  [key in 'emails' | 'addresses' | 'phones']: {
    validators: ValidatorFn[] | ValidatorFn;
    childrenKeys: string[];
    childrenValidators: ValidatorFn[];
  };
};
@Injectable({
  providedIn: 'root',
})
export class FormService {
  public entry: OrganizeEntry | ActivityEntry | null = null;
  public pageType: PageTypeEnum = PageTypeEnum.New;
  private providerType: ProviderTypeEnum = ProviderTypeEnum.Organizer;
  private formArraysMetaData: FormArrayType = {} as FormArrayType;
  constructor(private dataHttpService: DataHttpService) {
    if (this.providerType == ProviderTypeEnum.Organizer) {
      this.formArraysMetaData = {
        emails: {
          validators: [Validators.required],
          childrenKeys: ['emailAddress', 'label'],
          childrenValidators: [Validators.email, Validators.minLength(8)],
        },
        addresses: {
          validators: [Validators.required],
          childrenKeys: ['address', 'label'],
          childrenValidators: [Validators.minLength(8)],
        },
        phones: {
          validators: [Validators.required],
          childrenKeys: ['phoneNumber', 'label'],
          childrenValidators: [
            Validators.minLength(8),
            Validators.pattern('^[0-9|+][0-9 -]*$'),
          ],
        },
      };
    } else {
    }
    // console.log('pageType', this.pageType, 'entry', this.entry);
  }
  public getFormArraysMetaData() {
    return this.formArraysMetaData;
  }
  public removeFromFormArray(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }

  public save(
    formValue: Partial<EntryType>,
    pageType: PageTypeEnum,
    u_id?: string
  ) {
    if (pageType === PageTypeEnum.New) {
      return this.dataHttpService.createEntry(formValue);
    }
    return this.dataHttpService.updateEntry(formValue, u_id!);
  }
  public getEntryInfo() {
    let entry = JSON.parse(localStorage.getItem('entry')!);
    let pageType = localStorage.getItem('pageType');
    let providerType = localStorage.getItem('providerType');
    return [entry, pageType, providerType] as [
      OrganizeEntry | ActivityEntry,
      PageTypeEnum,
      ProviderTypeEnum
    ];
  }
}
