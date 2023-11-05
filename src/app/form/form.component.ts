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
import { EntryType } from '../models/data-request-api';
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
  entry = {};
  formArrays: FormArrayType = {
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
  }
  form = new FormGroup({
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
  addToFormArray(
    inputHtml: HTMLInputElement,
    formArray: FormArray,
    formArraykey: FormArrayKeysType
  ) {
    let chKeys = this.formArrays[formArraykey].childrenKeys;
    let Validators = this.formArrays[formArraykey].validators;
    let childrenValidators = this.formArrays[formArraykey].childrenValidators;

    formArray.push(
      new FormGroup(
        {
          [chKeys[0]]: new FormControl(inputHtml.value, childrenValidators),
          [chKeys[1]]: new FormControl('label ' + Math.random() * 10),
        },
        Validators
      )
    );
    inputHtml.value = '';
  }
  removeFromFormArray(formArray: FormArray, index: number) {
    //let index = this.accessEmails.controls.indexOf(emails);
    formArray.removeAt(index);
  }

  save() {
    this.submitted = true;
    let data: Partial<EntryType> = this.form.value;
    if (this.form.valid)
      this.saverSubscribtion = this.dataHttpService
        .createEntry(data)
        .subscribe((x) => {
          this.location.back();
        });
    console.log(this.form, this.form.get('organizer:emails'));
    //this.form.setErrors({ invalidLogin: true });
  }
  ngOnDestroy(): void {
    this.saverSubscribtion?.unsubscribe();
  }
}
