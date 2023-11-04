import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormValidator } from './form.validators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  submitted = false;
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(8)]),
    emails: new FormArray([], Validators.required),
    addresses: new FormArray([], Validators.required),
    organizationActivity: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    phones: new FormArray([], Validators.required),
    website: new FormControl('', [
      Validators.required,
      Validators.pattern('https?://.+|http?://.+'),
    ]),
  });

  // private _createFormArrayControls(): FormControl {
  //   return this.form.addControl(
  //     '1',
  //     this.form.get('addresses') as AbstractControl
  //   );
  // }
  get accessName() {
    return this.form.get('name') as FormControl;
  }
  get accessEmails() {
    return this.form.controls['emails'] as FormArray;
  }
  get accessAddresses() {
    return this.form.get('addresses') as FormArray;
  }
  get accessOrganizationActivity() {
    return this.form.get('organizationActivity') as FormControl;
  }
  get accessPhones() {
    return this.form.get('phones') as FormArray;
  }
  get accessWebsite() {
    return this.form.get('website') as FormControl;
  }
  addEmail(email: HTMLInputElement) {
    console.log(this.form.get('emails'), this.form.get('emails')?.invalid);
    // if(this.form.get('emails')?.getError('email'))
    // console.log(
    //   this.form
    //     .get('emails')
    //     ?.valueChanges.subscribe((c) => console.log('c', c))
    // );
    // debugger;
    let t = true;
    if (
      this.accessEmails.controls[this.accessEmails.controls.length - 1]
        ?.errors?.['minlength']
    ) {
      this.form.setErrors({ minCustom: true });
      t = false;
    }
    if (
      this.accessEmails.controls[this.accessEmails.controls.length - 1]
        ?.errors?.['email']
    ) {
      this.form.setErrors({ emailCustom: true });
      t = false;
    }
    if (t)
      this.accessEmails.push(
        new FormControl(email.value, [
          Validators.email,
          Validators.minLength(8),
        ])
      );
    // console.log(this.form.get('emails'), this.form.get('emails')?.invalid);

    //this.form.get('emails')?.updateValueAndValidity();
    if (t) email.value = '';
    console.log(this.form.get('emails'));
  }
  removeEmail(email: AbstractControl) {
    let index = this.accessEmails.controls.indexOf(email as FormControl);
    this.accessEmails.removeAt(index);
  }
  addAddress(addressHtml: HTMLInputElement) {
    //this.accessAddresses.push(new FormControl(addressHtml.value));
    this.accessAddresses.push(
      new FormControl(addressHtml.value, [Validators.minLength(8)])
    );
    addressHtml.value = '';
  }
  removeAddress(address: AbstractControl) {
    let index = this.accessAddresses.controls.indexOf(address as FormControl);
    this.accessAddresses.removeAt(index);
  }
  addPhone(phoneHtml: HTMLInputElement) {
    console.log(this.form.get('phones'));

    this.accessPhones.push(
      new FormControl(phoneHtml.value, [
        Validators.minLength(8),
        Validators.pattern('^[0-9|+][0-9 -]*$'),
      ])
    );
    phoneHtml.value = '';
  }
  removePhone(phone: AbstractControl) {
    let index = this.accessPhones.controls.indexOf(phone as FormControl);
    this.accessPhones.removeAt(index);
  }
  onSubmit() {
    this.submitted = true;
    // imagine there is a service call login in this point of code
    // let isValid = serviceAuth?.login(this.form.value);
    // if (isValid) {
    //   this.form.setErrors({ invalidLogin: true });
    // }
    console.log(this.form);
    //this.form.setErrors({ invalidLogin: true });
  }
}
