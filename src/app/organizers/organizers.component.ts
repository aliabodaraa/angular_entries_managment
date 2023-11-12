import { Component } from '@angular/core';
import { ProviderTypeEnum } from '../models/data-request-api';
import { TableColumns } from '../models/table-inputs';
import { columns } from './columns-names';

@Component({
  selector: 'app-organizers',
  templateUrl: './organizers.component.html',
  styleUrls: ['./organizers.component.css'],
})
export class OrganizersComponent {
  type: ProviderTypeEnum = ProviderTypeEnum.Organizer;
  public columns: TableColumns = columns;
  constructor() {}
}
