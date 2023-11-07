import { Component, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PageRequestParams,
  ProviderPageEnum,
  ProviderTypeEnum,
  EntryType,
  OrganizeEntry,
  ActivityEntry,
  PageTypeEnum,
  DeletionIdentifiersEnum,
} from '../models/data-request-api';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { DataHttpService } from '../services/dataHttp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isActivityEntry } from '../models/data-request-api';
import { TOASTR_TOKEN, Toastr } from '../services/toastr.service';
import { EntryService } from '../services/entry.service';
interface State {
  pageIndex: number;
  pageSize: number;
  totalSize: number;
}
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
  columns!: string[];
  constructor(
    private EntryService: EntryService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: Toastr
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
    this.columns = this.EntryService.entryPropertiesAllowedToAppearInTable(
      this.type
    );
    console.log('type--------------', this.type, this.columns);
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
    this.router.navigate([path]);
    this.EntryService.storgeEntryInfo(this.type, entry);
  }
  public deleteEntry(entry: EntryType) {
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

  intoString(value: unknown) {
    return String(value);
  }
  counter(i: number) {
    return new Array(i);
  }
}
// if (isActivityEntry(entries)) return entries else ;
