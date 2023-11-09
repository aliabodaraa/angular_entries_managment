import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PageTypeEnum, ProviderTypeEnum } from '../models/data-request-api';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormArrayActivityKeysType } from '../models/form';
import * as form from '../models/form';
import { Location } from '@angular/common';

import { EntryService } from '../services/entry.service';
import { TOASTR_TOKEN, Toastr } from '../services/toastr.service';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EntryType, isActivityEntry } from '../models/app_data_state';
type OrganizerObjectType = { id: string; name: string };

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
})
export class ActivityFormComponent implements OnInit, OnDestroy {
  submitted = false;
  entry: EntryType | null = null;
  pageType!: PageTypeEnum;
  providerType!: ProviderTypeEnum;
  model!: NgbDateStruct;
  today = this.calendar.getToday();
  form!: FormGroup;
  organizers_objects!: OrganizerObjectType[];

  constructor(
    private location: Location,
    private EntryService: EntryService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar
  ) {
    if (this.entry)
      // [this.entry, this.pageType, this.providerType] =
      //   this.EntryService.getEntryInfo() as [
      //     ActivityEntry,
      //     PageTypeEnum,
      //     ProviderTypeEnum
      //   ];

      console.log('pageType', this.pageType, 'entry', this.entry);
    if (this.entry) {
      // this.mapEntryToForm();
    }
  }
  meridian = true;

  toggleMeridian() {
    this.meridian = !this.meridian;
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      numberOfTickets: ['', Validators.required],
      tickets: new FormArray([]),
      'dc:title': ['', Validators.required],
      'dc:description': ['', Validators.required],
      'activity:categorization': ['', Validators.required],
      'activity:locations': this.formBuilder.array([
        this.formBuilder.group({
          city: ['111111'],
          geographicLocation: ['222222'],
        }),
      ]),
      'activity:organizers': ['', Validators.required],
      'activity:startDate': ['', [Validators.required]],
      'activity:endDate': ['', Validators.required],
      'activity:timeFrom': ['', Validators.required],
      'activity:timeTo': ['', Validators.required],
      'activity:coverPicture': ['', Validators.required],
    });
    //here request
    this.EntryService.getEntries(ProviderTypeEnum.Organizer).subscribe((x) => {
      let organizers_obj = x.entries.map((entry: any) => {
        let org_obj: OrganizerObjectType = { id: '', name: '' };
        org_obj.id = entry.uid;
        org_obj.name = entry.properties['organizer:name'];
        return org_obj;
      });
      this.organizers_objects = organizers_obj;
    });
  }
  get f() {
    return this.form.controls;
  }
  get t() {
    return this.f.tickets as FormArray;
  }
  get accessLocationArray() {
    return this.f['activity:locations'] as FormArray;
  }
  get accessLocationControls() {
    return this.accessLocationArray.controls as FormGroup[];
  }
  // get accessOrganizersArray() {
  //   return this.form.get('activity:organizers') as FormArray;
  // }
  // get accessOrganizersControls() {
  //   return this.accessOrganizersArray.controls as FormControl[];
  // }
  get ticketFormGroups() {
    return this.t.controls as FormGroup[];
  }

  onChangeTickets(e: any) {
    const numberOfTickets = e.target.value || 0;
    if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
        this.t.push(
          this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
          })
        );
      }
    } else {
      for (let i = this.t.length; i >= numberOfTickets; i--) {
        this.t.removeAt(i);
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value, null, 4));
  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.form.reset();
    this.t.clear();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.submitted = false;
    this.t.reset();
  }
  addLocation() {
    this.accessLocationControls.push(
      this.formBuilder.group({
        city: [
          '111122222222211',
          [Validators.required, Validators.minLength(8)],
        ],
        geographicLocation: [
          '222222',
          [Validators.required, Validators.minLength(8)],
        ],
      })
    );
  }
  // addOrganizer() {
  //   this.accessOrganizersControls.push(this.formBuilder.control('aa'));
  //   console.log(this.accessOrganizersArray.value);
  // }

  private mapEntryToForm() {
    if (this.entry && isActivityEntry(this.entry)) {
      //  this.entry['activity:organizers'].map((org_name) => {
      //    return this.addToFormArray(org_name, this.accessOrganizers, 'emails');
      //  });
      //  this.entry['activity:locations'].map((a_obj) => {
      //    return this.addToFormArray(
      //      a_obj.address,
      //      this.accessLocations,
      //      'locations'
      //    );
      //  });
      this.form.patchValue({
        'dc:title': this.entry['dc:title'],
        'dc:description': this.entry['dc:description'],
        'activity:categorization': this.entry['activity:categorization'],
        'activity:startDate': this.entry['activity:startDate'],
        'activity:endDate': this.entry['activity:endDate'],
        'activity:timeFrom': this.entry['activity:timeFrom'],
        'activity:timeTo': this.entry['activity:timeTo'],
        'activity:coverPicture': this.entry['activity:coverPicture'],
      });
      for (const key in this.entry) {
        this.form.controls[key]?.markAllAsTouched();
      }
    }
  }
  public addToFormArray(
    formArray: FormArray,
    formArraykey: FormArrayActivityKeysType,
    ...newValues: HTMLInputElement[]
  ) {
    let propActivitiesMetaData =
      form.default.getControlsOfActivityPropertiesMetaData()[formArraykey];
    let type = propActivitiesMetaData.type;
    let chKeys = propActivitiesMetaData.childrenKeys;
    let Validators = propActivitiesMetaData.validators;
    let childrenValidators = propActivitiesMetaData.childrenValidators;
    if (type === 'arr_controls') {
      formArray.push(new FormControl(newValues[0].value, Validators));
    } else if (chKeys?.length)
      formArray.push(
        new FormGroup(
          {
            [chKeys[0]]: new FormControl(
              newValues[0].value,
              childrenValidators
            ),
            [chKeys[1]]: new FormControl(newValues[1].value),
          },
          Validators
        )
      );
    for (const inputElement of newValues) {
      inputElement.value = '';
    }
  }
  public removeFromFormArray(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }
  reqApi = [1, 2];
  public save() {
    this.submitted = true;
    let formValue: Partial<EntryType> = this.form.value;

    console.log(this.form);
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
