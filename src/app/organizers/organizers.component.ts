import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Organizer } from '../models/organizer';
import { NgbdSortableHeader, SortEvent } from './soartable.directive';
import { OrganizerService } from '../services/organizer.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { OrganizerDataTableService } from '../services/organizer-data-table.service';

@Component({
  selector: 'app-organizers',
  templateUrl: './organizers.component.html',
  styleUrls: ['./organizers.component.css'],
})
export class OrganizersComponent implements OnInit {
  ngOnInit(): void {}
  organizers$: Observable<Organizer[]>;
  total$: Observable<number>;

  constructor(
    // public org_service: OrganizerService,
    public organizerDataTable: OrganizerDataTableService,
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {
    //this.organizers$ = org_service.organizers$;
    this.organizers$ = organizerDataTable.data$;
    this.total$ = organizerDataTable.total$;
    console.log(this.keycloakService.getToken().then((t) => console.log(t)));
    this.http
      .get('http://54.227.55.65/nuxeo/api/v1/search/pp/PP_Organizar/execute')
      .toPromise()
      .then((x) => console.log(x))
      .catch((x) => console.log(x));
  }
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> =
    new QueryList();

  // onSort({ column }: SortEvent) {
  //   this.organizerDataTable.sortColumn = column;
  //   this.organizerDataTable.sortDirection = 'asc';
  // }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.organizerDataTable.sortColumn = column;
    this.organizerDataTable.sortDirection = direction;
  }
}
