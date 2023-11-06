import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PageRequestParams,
  ProviderPageEnum,
  ProviderTypeEnum,
  EntryType,
  OrganizeEntry,
  ActivityEntry,
} from '../models/data-request-api';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { DataHttpService } from '../services/dataHttp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isActivityEntry } from '../models/data-request-api';
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
  navigateToEntryFromEdit(entry: EntryType) {
    let path = this.is_organizers ? '/organizers/edit' : '/activities/edit';
    this.router.navigate([path], {
      state: {
        entry,
      },
    });
  }
  public is_organizers = true;
  constructor(
    private dataHttpService: DataHttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.is_organizers = this.route.snapshot.url[0].path.includes('organizers');
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
  counter(i: number) {
    return new Array(i);
  }
  private getData() {
    let pageProvider = this.is_organizers
      ? ProviderPageEnum.PP_Organizar
      : ProviderPageEnum.PP_Activity;

    let params: PageRequestParams = {
      pageSize: this.pageSize,
      currentPageIndex: this.pageIndex - 1,
      properties: '*',
    };

    return this.dataHttpService.getData(pageProvider, params);
  }
  intoString(value: unknown) {
    return String(value);
  }
  columnsAllowedToAppear() {
    let coulumns = [
      'title',
      'creator',
      'description',
      'creation_date',
      'modified_date',
    ];
    if (this.is_organizers) {
      coulumns = [
        'name',
        'creator',
        'website',
        'creation_date',
        'modified_date',
      ];
    }
    return coulumns;
  }
  private exctractEntriesFromResponse(res: any) {
    let entries: ActivityEntry[] | OrganizeEntry[] = [];
    if (this.is_organizers)
      entries = res.entries.map((e: any) => ({
        uid: e.uid,
        creation_date: e.properties['dc:created'],
        modified_date: e.properties['dc:modified'],
        creator: e.properties['dc:creator'],
        name: e.properties['organizer:name'],
        website: e.properties['organizer:website'],
        emails: e.properties['organizer:emails'],
        addresses: e.properties['organizer:addresses'],
        organizationActivity: e.properties['organizer:organizationActivity'],
        phones: e.properties['organizer:phones'],
      }));
    else
      entries = res.entries.map((e: any) => ({
        uid: e.uid,
        creation_date: e.properties['dc:created'],
        modified_date: e.properties['dc:modified'],
        creator: e.properties['dc:creator'],
        title: e.properties['dc:title'],
        description: e.properties['dc:description'],
        organizers: e.properties['activity:organizers'],
        locations: e.properties['activity:locations'],
        startDate: e.properties['activity:startDate'],
        endDate: e.properties['activity:endDate'],
        timeFrom: e.properties['activity:timeFrom'],
        timeTo: e.properties['activity:timeTo'],
      }));
    return entries;
  }
}
// if (isActivityEntry(entries)) return entries else ;
