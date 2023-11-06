import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DataHttpService } from '../services/dataHttp.service';
import { Router } from '@angular/router';
import {
  ActivityEntry,
  EntryType,
  OrganizeEntry,
  isActivityEntry,
} from '../models/data-request-api';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
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
  entry: OrganizeEntry | ActivityEntry;
  pageType: 'new' | 'edit' = 'new';
  private formArrays: FormArrayType = {
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
  public form = new FormGroup({
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
  saverSubscribtion: Subscription | null = null;
  constructor(
    private dataHttpService: DataHttpService,
    private router: Router,
    private location: Location
  ) {
    this.entry = this.router.getCurrentNavigation()?.extras.state?.['entry'];
    // if (!this.entry) {
    //   this.router.navigate(['']);
    // }
    console.log(this.entry);
    this.pageType =
      this.router.getCurrentNavigation()?.extras.state?.['pageType'];
    console.log(this.pageType);
    if (this.pageType === 'edit' && !isActivityEntry(this.entry)) {
      this.entry['organizer:emails'].map((e) => {
        return this.addToFormArray(e.emailAddress, this.accessEmails, 'emails');
      });
      this.entry['organizer:addresses'].map((e) => {
        return this.addToFormArray(
          e.address,
          this.accessAddresses,
          'addresses'
        );
      });
      this.entry['organizer:phones'].map((p) => {
        return this.addToFormArray(p.phoneNumber, this.accessPhones, 'phones');
      });
      this.form.patchValue({
        'organizer:name': this.entry['organizer:name'],
        'organizer:organizationActivity':
          this.entry['organizer:organizationActivity'],
        'organizer:website': this.entry['organizer:website'],
      });
    }
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
  public addToFormArray(
    newValue: HTMLInputElement | string,
    formArray: FormArray,
    formArraykey: FormArrayKeysType
  ) {
    let enteredValue = typeof newValue !== 'string' ? newValue.value : newValue;
    let chKeys = this.formArrays[formArraykey].childrenKeys;
    let Validators = this.formArrays[formArraykey].validators;
    let childrenValidators = this.formArrays[formArraykey].childrenValidators;

    formArray.push(
      new FormGroup(
        {
          [chKeys[0]]: new FormControl(enteredValue, childrenValidators),
          [chKeys[1]]: new FormControl('label ' + Math.random() * 10),
        },
        Validators
      )
    );
    if (typeof newValue == 'string') enteredValue = '';
  }
  removeFromFormArray(formArray: FormArray, index: number) {
    //let index = this.accessEmails.controls.indexOf(emails);
    formArray.removeAt(index);
  }

  save() {
    this.submitted = true;

    let entry_content: EntryType = this.form.value;

    if (this.form.valid) {
      if (this.pageType === 'new')
        this.saverSubscribtion = this.dataHttpService
          .createEntry(entry_content)
          .subscribe((x) => {
            this.location.back();
          });
      else {
        let entry_uid: string = this.entry.uid;
        this.saverSubscribtion = this.dataHttpService
          .updateEntry(entry_content, entry_uid)
          .subscribe((x) => {
            this.location.back();
          });
      }
    }
    console.log(this.form, this.form.get('organizer:emails'));
  }
  ngOnDestroy(): void {
    this.saverSubscribtion?.unsubscribe();
  }
}
