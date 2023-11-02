import { Component } from '@angular/core';
import { OrganizerService } from '../services/organizer.service';

@Component({
  selector: 'app-organizers',
  templateUrl: './organizers.component.html',
  styleUrls: ['./organizers.component.css'],
})
export class OrganizersComponent {
  pageSize: number = 0; //15
  currentPageIndex: number = 0; //0

  constructor(public organizerService: OrganizerService) {}
}
