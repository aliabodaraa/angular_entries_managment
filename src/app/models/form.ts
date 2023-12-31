import { ValidatorFn, Validators } from '@angular/forms';

export type FormArrayOrganizerKeysType = 'emails' | 'addresses' | 'phones';
export type FormArrayActivityKeysType =
  | 'activity:locations'
  | 'activity:organizers'
  | 'activity:coverPicture';
type FormArrayKeysType = FormArrayOrganizerKeysType | FormArrayActivityKeysType;
export type FormArrayType = {
  [key in FormArrayKeysType]: {
    type:
      | 'arr_controls'
      | 'arr_groups'
      | 'group'
      | 'control_number'
      | 'control_string';
    validators: ValidatorFn[] | ValidatorFn;
    childrenKeys?: string[];
    childrenValidators: ValidatorFn[];
  };
};
let getArraysOrganizerMetaData = () =>
  ({
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
  } as FormArrayType);
let getControlsOfActivityPropertiesMetaData = () =>
  ({
    'activity:locations': {
      type: 'arr_groups',
      validators: [Validators.required],
      childrenKeys: ['city', 'geographicLocation'],
      childrenValidators: [Validators.minLength(8)],
    },
    'activity:organizers': {
      type: 'arr_controls',
      validators: [Validators.required],
      childrenValidators: [Validators.minLength(8)],
    },
    'activity:coverPicture': {
      type: 'arr_controls',
      validators: [Validators.required],
      childrenValidators: [Validators.minLength(8)],
    },
  } as FormArrayType);
export default {
  getArraysOrganizerMetaData,
  getControlsOfActivityPropertiesMetaData,
};
