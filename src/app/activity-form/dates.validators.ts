import {
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export function creatDateRangeValidator() {
  return (form: FormGroup): ValidationErrors | null => {
    const start: string = form.controls['activity:startDate'].value;
    const end: string = form.controls['activity:endDate'].value;
    if (start && end) {
      let s = new Date(start).getTime();
      let e = new Date(end).getTime();
      const isRangeValid = e - s > 0;
      //console.log(start , end)
      return isRangeValid ? null : { dateRange: true };
    }

    return null;
  };
}
// static atLeastOneAuthor(): ValidatorFn {
//   return (control: AbstractControl) => {
//     const controlArray = control as FormArray;
//     if (controlArray.controls.some(el => el.value)) {
//       return null;
//     } else {
//       return {
//         atLeastOneAuthor: { valid: false }
//       }
//     }
//   }
// }
