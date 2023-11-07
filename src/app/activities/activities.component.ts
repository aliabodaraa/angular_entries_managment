import { Component, OnInit } from '@angular/core';
import { ProviderTypeEnum } from '../models/data-request-api';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent {
  type: ProviderTypeEnum = ProviderTypeEnum.Activity;
  constructor() {}
}
