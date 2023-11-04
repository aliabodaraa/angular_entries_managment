import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormValidator {
  static cannotContainDash(control: AbstractControl): ValidationErrors | null {
    console.log(control.value);
    if ((control.value as string).indexOf('-') > 0) {
      console.log(control.value);
      return {
        cannotContainDash: true,
      };
    }
    return null;
  }
  static shouldBeUniqueAsync(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'ali') resolve({ shouldBeUniqueAsync: true });
        else resolve(null);
      }, 2000);
    });
  }
}
