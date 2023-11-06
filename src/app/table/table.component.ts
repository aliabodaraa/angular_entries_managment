import { Component } from '@angular/core';
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
  public navigateToEditPage(entry: EntryType) {
    const path = this.is_organizers ? '/organizers/edit' : '/activities/edit';
    this.router.navigate(
      [path]
      //   , {
      //   state: {
      //     pageType: 'edit',
      //     providerType: ProviderTypeEnum,
      //   },
      // }
    );
    this.storgeEntryInfo(entry);
  }
  public deleteEntry(entry: EntryType) {
    let deletion_identifier = this.is_organizers
      ? DeletionIdentifiersEnum.Organizer
      : DeletionIdentifiersEnum.Activity;
    console.log(entry);
    this.dataHttpService
      .deleteEntry(entry.uid, deletion_identifier)
      .subscribe((res) => {
        this.trigger_change$.next();
        console.log('Deleted the Entry Successfully');
      });
  }
  private storgeEntryInfo(entry: EntryType) {
    localStorage.setItem('entry', JSON.stringify(entry));
    localStorage.setItem('pageType', JSON.stringify(PageTypeEnum.Edit));
    localStorage.setItem(
      'providerType',
      JSON.stringify(
        this.is_organizers
          ? ProviderTypeEnum.Organizer
          : ProviderTypeEnum.Activity
      )
    );
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
      'dc:title',
      'dc:creator',
      'dc:description',
      'dc:created',
      'dc:modified',
    ];
    if (this.is_organizers) {
      coulumns = [
        'organizer:name',
        'dc:creator',
        'organizer:website',
        'dc:created',
        'dc:modified',
      ];
    }
    return coulumns;
  }
  private exctractEntriesFromResponse(res: any) {
    let entries: ActivityEntry[] | OrganizeEntry[] = [];
    if (this.is_organizers)
      entries = res.entries.map((e: any) => ({
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
    else
      entries = res.entries.map((e: any) => ({
        uid: e.uid,
        'dc:created': e.properties['dc:created'],
        'dc:modified': e.properties['dc:modified'],
        'dc:creator': e.properties['dc:creator'],
        'dc:title': e.properties['dc:title'],
        'dc:description': e.properties['dc:description'],
        'activity:organizers': e.properties['activity:organizers'],
        'activity:locations': e.properties['activity:locations'],
        'activity:startDate': e.properties['activity:startDate'],
        'activity:endDate': e.properties['activity:endDate'],
        'activity:timeFrom': e.properties['activity:timeFrom'],
        'activity:timeTo': e.properties['activity:timeTo'],
      }));
    return entries;
  }
}
// if (isActivityEntry(entries)) return entries else ;
