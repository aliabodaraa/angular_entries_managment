import { Component } from '@angular/core';
import { ProviderTypeEnum } from '../models/data-request-api';

@Component({
  selector: 'app-organizers',
  templateUrl: './organizers.component.html',
  styleUrls: ['./organizers.component.css'],
})
export class OrganizersComponent {
  type: ProviderTypeEnum = ProviderTypeEnum.Organizer;
  constructor() {}
}
