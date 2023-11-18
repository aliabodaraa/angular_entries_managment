import { Component, Inject, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageTypeEnum, ProviderTypeEnum } from '../models/data-request-api';
import { Location } from '@angular/common';
import { EntryService } from '../services/entry.service';
import * as form from '../models/form';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { EntryType, isOrganizerEntry } from '../models/app_data_state';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  templateUrl: './organizer-form.component.html',
  styleUrls: ['./organizer-form.component.scss'],
})
export class OrganizerFormComponent implements OnDestroy {
  submitted = false;
  entry: EntryType | null;
  pageType!: PageTypeEnum;
  providerType!: ProviderTypeEnum;
  public form!: FormGroup;
  public is_emails_list_shown = false;
  public is_addresses_list_shown = false;
  public is_phones_list_shown = false;

  constructor(
    private location: Location,
    private EntryService: EntryService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.entry = this.EntryService.getEntryInfo() ?? null;
    this.route.queryParamMap.pipe(take(1)).subscribe((queryParams) => {
      this.pageType = queryParams.get('page_type')! as PageTypeEnum;
      this.providerType = queryParams.get('provider_type')! as ProviderTypeEnum;
    });

    this.form = new FormGroup({
      'organizer:name': new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      'organizer:emails': new FormArray([], Validators.required),
      'organizer:addresses': new FormArray([], Validators.required),
      'organizer:organizationActivity': new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      'organizer:phones': new FormArray([], Validators.required),
      'organizer:website': new FormControl('', [
        Validators.required,
        Validators.pattern('https?://.+|http?://.+'),
      ]),
    });
    console.log(
      'providerType',
      this.providerType,
      'pageType',
      this.pageType,
      'entry',
      this.entry
    );
    if (this.entry) {
      this.mapEntryToForm();
    }
  }

  private mapEntryToForm() {
    console.log(typeof this.entry);
    if (this.entry && isOrganizerEntry(this.entry)) {
      this.entry['organizer:emails'].map((e_obj) => {
        return this.addToFormArray(
          e_obj.emailAddress,
          this.accessEmails,
          'emails'
        );
      });
      this.entry['organizer:addresses'].map((a_obj) => {
        return this.addToFormArray(
          a_obj.address,
          this.accessAddresses,
          'addresses'
        );
      });
      this.entry['organizer:phones'].map((p_obj) => {
        return this.addToFormArray(
          p_obj.phoneNumber,
          this.accessPhones,
          'phones'
        );
      });
      this.form.patchValue({
        'organizer:name': this.entry['organizer:name'],
        'organizer:organizationActivity':
          this.entry['organizer:organizationActivity'],
        'organizer:website': this.entry['organizer:website'],
      });
      for (const key in this.entry) {
        this.form.controls[key]?.markAllAsTouched();
      }
    }
  }
  public addToFormArray(
    newValue: HTMLInputElement | string,
    formArray: FormArray,
    formArraykey: form.FormArrayOrganizerKeysType
  ) {
    let arraysOrganizer =
      form.default.getArraysOrganizerMetaData()[formArraykey];
    let enteredValue = typeof newValue !== 'string' ? newValue.value : newValue;
    let chKeys = arraysOrganizer.childrenKeys;
    let Validators = arraysOrganizer.validators;
    let childrenValidators = arraysOrganizer.childrenValidators;

    if (chKeys?.length)
      formArray.push(
        new FormGroup(
          {
            [chKeys[0]]: new FormControl(enteredValue, childrenValidators),
            [chKeys[1]]: new FormControl('label ' + Math.random() * 10),
          },
          Validators
        )
      );
    if (typeof newValue !== 'string') newValue.value = '';
  }
  public removeFromFormArray(formArray: FormArray, index: number) {
    //let index = this.accessEmails.controls.indexOf(emails);
    formArray.removeAt(index);
  }

  get accessName() {
    return this.form.get('organizer:name') as FormControl;
  }
  get accessEmails() {
    return this.form.get('organizer:emails') as FormArray;
  }
  get accessEmailAddress() {
    //under maintainance
    return this.form.get('organizer:emails')?.value[0]?.emailAddress;
  }
  get accessAddresses() {
    return this.form.get('organizer:addresses') as FormArray;
  }
  get accessOrganizationActivity() {
    return this.form.get('organizer:organizationActivity') as FormControl;
  }
  get accessPhones() {
    return this.form.get('organizer:phones') as FormArray;
  }
  get accessWebsite() {
    return this.form.get('organizer:website') as FormControl;
  }

  public save() {
    this.submitted = true;
    let formValue: Partial<EntryType> = this.form.value;

    console.log(
      this.pageType,
      '--------------------------------',
      this.providerType,
      '--------------------------------',
      this.entry
    );
    if (this.form.valid) {
      if (this.pageType === PageTypeEnum.New) {
        this.EntryService.saveUpdateEntry(
          this.providerType,
          formValue,
          this.pageType
        ).subscribe(
          (s) => {
            this.location.back();
            this.toastr.success(
              'New Organizer Added Successfully',
              'Organizer'
            );
          },
          (e) => {
            this.toastr.error('Adding Organizer Process Failed', 'Organizer');
          }
        );
      } else if (this.pageType === PageTypeEnum.Edit && this.entry) {
        this.EntryService.saveUpdateEntry(
          this.providerType,
          formValue,
          this.pageType,
          this.entry.uid
        ).subscribe(
          (s) => {
            this.location.back();
            this.toastr.info('New Organizer Updated Successfully', 'Organizer');
          },
          (e) => {
            this.toastr.error(
              'Updateding Organizer Process Failed',
              'Organizer'
            );
          }
        );
      }
    }
    console.log(this.pageType);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('entry');
    localStorage.removeItem('pageType');
    localStorage.removeItem('providerType');
  }
}
