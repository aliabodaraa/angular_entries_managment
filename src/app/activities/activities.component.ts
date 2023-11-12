import { Component } from '@angular/core';
import { ProviderTypeEnum } from '../models/data-request-api';
import { TableColumns } from '../models/table-inputs';
import { columns } from './columns-names';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent {
  type: ProviderTypeEnum = ProviderTypeEnum.Activity;
  public columns: TableColumns = columns;
  constructor() {}
}
