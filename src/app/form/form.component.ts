import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  ActivityEntry,
  EntryType,
  OrganizeEntry,
  PageTypeEnum,
  ProviderTypeEnum,
  isActivityEntry,
} from '../models/data-request-api';
import { Location } from '@angular/common';
import { TOASTR_TOKEN, Toastr } from '../services/toastr.service';
import { EntryService } from '../services/entry.service';
type FormArrayKeysType = 'emails' | 'addresses' | 'phones';
type FormArrayType = {
  [key in FormArrayKeysType]: {
    validators: ValidatorFn[] | ValidatorFn;
    childrenKeys: string[];
    childrenValidators: ValidatorFn[];
  };
};
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
  submitted = false;
  entry: OrganizeEntry | ActivityEntry | null = null;
  pageType: PageTypeEnum;
  providerType: ProviderTypeEnum;
  public form!: FormGroup;
  private formArraysMetaData: FormArrayType = {
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
  constructor(
    private location: Location,
    private EntryService: EntryService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr
  ) {
    [this.entry, this.pageType, this.providerType] =
      this.EntryService.getEntryInfo();
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
    console.log('pageType', this.pageType, 'entry', this.entry);
    if (this.entry) {
      this.mapEntryToForm();
    }
  }

  private mapEntryToForm() {
    if (this.entry && !isActivityEntry(this.entry)) {
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
    formArraykey: FormArrayKeysType
  ) {
    let enteredValue = typeof newValue !== 'string' ? newValue.value : newValue;
    let chKeys = this.formArraysMetaData[formArraykey].childrenKeys;
    let Validators = this.formArraysMetaData[formArraykey].validators;
    let childrenValidators =
      this.formArraysMetaData[formArraykey].childrenValidators;

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
    let entry_content: Partial<EntryType> = this.form.value;

    console.log(this.form);
    if (this.form.valid) {
      if (this.pageType === PageTypeEnum.New) {
        this.EntryService.saveUpdateEntry(
          entry_content,
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
      } else if (this.entry) {
        this.EntryService.saveUpdateEntry(
          entry_content,
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
