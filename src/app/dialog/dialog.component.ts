import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntryType } from '../models/app_data_state';
import { ProviderTypeEnum } from '../models/data-request-api';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  data;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: { entry: EntryType; type: ProviderTypeEnum }
  ) {
    this.data = data;
    console.log('Data is : ', data);
  }
  ngOnInit(): void {}
}
