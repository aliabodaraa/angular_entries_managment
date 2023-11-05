import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataHttpService } from '../services/dataHttp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryType } from '../models/data-request-api';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  submitted = false;
  entry = {};
  constructor(
    private dataHttpService: DataHttpService,
    private route: ActivatedRoute,
    private router: Router
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

  // private _createFormArrayControls(): FormControl {
  //   return this.form.addControl(
  //     '1',
  //     this.form.get('organizer:addresses') as AbstractControl
  //   );
  // }
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
  addEmail(emailHtml: HTMLInputElement) {
    this.accessEmails.push(
      new FormGroup({
        emailAddress: new FormControl(emailHtml.value, [
          Validators.email,
          Validators.minLength(8),
        ]),
        label: new FormControl('label ' + Math.random() * 10),
      })
    );
    emailHtml.value = '';
  }
  removeEmail(emails: AbstractControl) {
    let index = this.accessEmails.controls.indexOf(emails);
    this.accessEmails.removeAt(index);
  }
  addAddress(addressHtml: HTMLInputElement) {
    //this.accessAddresses.push(new FormControl(addressHtml.value));
    this.accessAddresses.push(
      new FormGroup({
        address: new FormControl(addressHtml.value, [Validators.minLength(8)]),
        label: new FormControl('label ' + Math.random()),
      })
    );
    addressHtml.value = '';
  }
  removeAddress(address: AbstractControl) {
    let index = this.accessAddresses.controls.indexOf(address);
    this.accessAddresses.removeAt(index);
  }
  addPhone(phoneHtml: HTMLInputElement) {
    console.log(this.form.get('organizer:phones'));

    this.accessPhones.push(
      new FormGroup({
        phoneNumber: new FormControl(phoneHtml.value, [
          Validators.minLength(8),
          Validators.pattern('^[0-9|+][0-9 -]*$'),
        ]),
        label: new FormControl('label ' + Math.random()),
      })
    );
    phoneHtml.value = '';
  }
  removePhone(phone: AbstractControl) {
    let index = this.accessPhones.controls.indexOf(phone as FormControl);
    this.accessPhones.removeAt(index);
  }
  save() {
    this.submitted = true;
    // imagine there is a service call login in this point of code
    // let isValid = serviceAuth?.login(this.form.value);
    // if (isValid) {
    //   this.form.setErrors({ invalidLogin: true });
    // }
    let data: Partial<EntryType> = this.form.value;
    this.dataHttpService.createEntry(data).subscribe((x) => console.log(x));
    console.log(this.form, this.form.get('organizer:emails'));
    //this.form.setErrors({ invalidLogin: true });
  }
}
