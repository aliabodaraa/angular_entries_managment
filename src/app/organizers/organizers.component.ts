import { Component } from '@angular/core';
import { ProviderTypeEnum } from '../models/data-request-api';
import { TableColumns } from '../models/table-inputs';
import { columns } from './columns-names';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { EntryType, OrganizeEntry } from '../models/app_data_state';
import { OpertionEmitterType, PageRequestParams, State } from '../models/table';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrganizerService } from '../services/organizer.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-organizers',
  templateUrl: './organizers.component.html',
  styleUrls: ['./organizers.component.css'],
})
export class OrganizersComponent extends BaseComponent<OrganizeEntry> {
  type: ProviderTypeEnum = ProviderTypeEnum.Organizer;
  public columns: TableColumns = columns;
  public data!: OrganizeEntry[];
  public paginater_state!: State;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public service: OrganizerService
  ) {
    super(service, router, dialog);
    this.getData();
  }
  public executeOperation(operation_emitter_info: OpertionEmitterType) {
    let { entry, mode } = operation_emitter_info;
    if (mode == 'delete') {
      this.openDialog(entry as OrganizeEntry)
        .beforeClosed()
        .pipe(take(1))
        .subscribe((res) => {
          if (res == 'yes') this.deleteEntry(entry);
        });
      return;
    }
    if (mode == 'edit') this.openPage(`/organizers/${entry.uid}/edit`);
    if (mode == 'show') this.openPage(`/organizers/${entry.uid}`);

    this.service.storgeEntryInfo(entry as OrganizeEntry);
  }

  private deleteEntry(entry: EntryType) {
    this.service.deleteEntry(entry).subscribe((res) => {
      //this.trigger_change$.next();
      this.toastr.success('Organizer Deleted Successfully', 'Organizer');
      this.getData();
    });
  }
  public getData(params?: PageRequestParams) {
    console.log('params', params);
    this.service.getEntries(params).subscribe((p) => {
      this.buildPaginaterState(p);
      this.mapPureDataToEntries(p);
    });
  }
  private buildPaginaterState(pure_response: any) {
    this.paginater_state = {
      pageIndex: pure_response.pageIndex,
      pageSize: pure_response.pageSize,
      totalSize: pure_response.totalSize,
      numberOfPages: pure_response.numberOfPages,
    };
    console.log(this.paginater_state, '_________paginater_state_________');
  }
  private mapPureDataToEntries(pure_response: any) {
    this.data = pure_response.entries.map((e: any) => ({
      uid: e.uid,
      'dc:created': e.properties['dc:created'],
      'dc:modified': e.properties['dc:modified'],
      'dc:creator': e.properties['dc:creator'],
      'organizer:name': e.properties['organizer:name'],
      'organizer:website': e.properties['organizer:website'],
      'organizer:emails': e.properties['organizer:emails'],
      'organizer:addresses': e.properties['organizer:addresses'],
      'organizer:organizationActivity':
        e.properties['organizer:organizationActivity'],
      'organizer:phones': e.properties['organizer:phones'],
    }));
    console.log(this.data, '________data__________');
  }
}
