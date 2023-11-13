import { Component } from '@angular/core';
import { ProviderTypeEnum } from '../models/data-request-api';
import { TableColumns } from '../models/table-inputs';
import { columns } from './columns-names';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';
import { ActivityEntry, EntryType } from '../models/app_data_state';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OpertionEmitterType, PageRequestParams, State } from '../models/table';
import { ActivityService } from '../services/activity.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent extends BaseComponent<ActivityEntry> {
  type: ProviderTypeEnum = ProviderTypeEnum.Activity;
  public columns: TableColumns = columns;
  public data!: ActivityEntry[];
  public paginater_state!: State;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public service: ActivityService
  ) {
    super(service, router, dialog);
    this.getData();
  }

  public executeOperation(operation_emitter_info: OpertionEmitterType) {
    let { entry, mode } = operation_emitter_info;
    if (mode == 'delete') {
      this.openDialog(entry as ActivityEntry)
        .afterClosed()
        .pipe(take(1))
        .subscribe((res) => {
          if (res == 'yes') this.deleteEntry(entry);
        });
      return;
    }
    if (mode == 'edit') this.openPage(`/activities/${entry.uid}/edit`);
    if (mode == 'show') this.openPage(`/activities/${entry.uid}`);

    this.service.storgeEntryInfo(entry as ActivityEntry);
  }
  private deleteEntry(entry: EntryType) {
    this.service.deleteEntry(entry).subscribe((res) => {
      //this.trigger_change$.next();
      this.toastr.success('activity Deleted Successfully', 'Activity');
      this.getData({
        pageSize: 5,
        currentPageIndex: 0,
        properties: '*',
      });
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
      'dc:title': e.properties['dc:title'],
      'dc:description': e.properties['dc:description'],
      'activity:categorization': e.properties['activity:categorization'],
      'activity:organizers': e.properties['activity:organizers'],
      'activity:locations': e.properties['activity:locations'],
      'activity:startDate': e.properties['activity:startDate'],
      'activity:endDate': e.properties['activity:endDate'],
      'activity:timeFrom': e.properties['activity:timeFrom'],
      'activity:timeTo': e.properties['activity:timeTo'],
      'activity:coverPicture': e.properties['activity:coverPicture']?.data,
    }));
    console.log(this.data, '__________________');
  }
}
