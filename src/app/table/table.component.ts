import { Component, Inject, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PageRequestParams,
  ProviderTypeEnum,
} from '../models/data-request-api';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TOASTR_TOKEN, Toastr } from '../services/toastr.service';
import { EntryService } from '../services/entry.service';
import { EntryType, isOrganizerEntry } from '../models/app_data_state';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
interface State {
  pageIndex: number;
  pageSize: number;
  totalSize: number;
}
type KeysType = string[];
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private trigger_change$ = new Subject<void>();
  private _entries$ = new BehaviorSubject<any[]>([]);
  private _state: State = {
    pageIndex: 0,
    pageSize: 5,
    totalSize: 10,
  };
  @Input('type') type!: ProviderTypeEnum;

  public columns: { keys: Array<string>; values: Array<string> } = {
    keys: [''],
    values: [''],
  };
  constructor(
    private EntryService: EntryService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private dialog: MatDialog
  ) {
    this.trigger_change$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this.getData()),
        tap(() => this._loading$.next(false)),
        map((res) => {
          console.log(res);
          this.totalSize = res.totalSize;
          return this.exctractEntriesFromResponse(res);
        }),
        delay(200),
        tap(() => {
          this._loading$.next(false);
        })
      )
      .subscribe((entries) => {
        this._entries$.next(entries);
      });
    this.trigger_change$.next();
  }
  ngOnInit(): void {
    [this.columns.keys, this.columns.values] = [
      Object.keys(
        this.EntryService.entryPropertiesAllowedToAppearInTable(this.type)
      ),
      (this.columns.values = Object.values(
        this.EntryService.entryPropertiesAllowedToAppearInTable(this.type)
      )),
    ];
    console.log('type--------------', this.type, this.columns);
  }

  openDialog(entry: EntryType) {
    //the open method on the service MatDialog i designed to receive Component as a parameter
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { entry, type: this.type },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'yes') this.deleteEntry(entry);
    });
  }
  get pageSize(): number {
    return this._state.pageSize;
  }
  set pageSize(pageSize: number) {
    this._state.pageSize = pageSize;
    this.trigger_change$.next();
  }
  get pageIndex(): number {
    return this._state.pageIndex;
  }
  set pageIndex(pageIndex: number) {
    this._state.pageIndex = pageIndex;
    this.trigger_change$.next();
  }
  get totalSize(): number {
    return this._state.totalSize;
  }
  set totalSize(totalSize: number) {
    this._state.totalSize = totalSize;
  }
  get entries$() {
    return this._entries$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }

  public navigateToEditPage(entry: EntryType) {
    const path =
      this.type === ProviderTypeEnum.Organizer
        ? '/organizers/edit'
        : '/activities/edit';
    this.router.navigate([path], {
      queryParams: { provider_type: this.type, page_type: 'Edit' },
    });
    this.EntryService.storgeEntryInfo(entry);
  }
  private deleteEntry(entry: EntryType) {
    this.EntryService.deleteEntry(this.type, entry).subscribe((res) => {
      this.trigger_change$.next();
      this.type === ProviderTypeEnum.Organizer
        ? this.toastr.success('Organizer Deleted Successfully', 'Organizer')
        : this.toastr.success('Activity Deleted Successfully', 'Activity');
      console.log('Deleted the Entry Successfully');
    });
  }
  private getData() {
    let params: PageRequestParams = {
      pageSize: this.pageSize,
      currentPageIndex: this.pageIndex - 1,
      properties: '*',
    };

    return this.EntryService.getEntries(this.type, params);
  }
  private exctractEntriesFromResponse(pure_response: any) {
    return this.EntryService.mapPureDataToEntries(this.type, pure_response);
  }

  intoString(value: unknown | string) {
    return String(value);
  }
  counter(i: number) {
    return new Array(i);
  }
}
// if (isActivityEntry(entries)) return entries else ;
