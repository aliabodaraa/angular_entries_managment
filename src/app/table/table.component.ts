import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PageRequestParams,
  ProviderPageEnum,
  ProviderTypeEnum,
  EntryType,
} from '../models/data-request-api';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { DataHttpService } from '../services/dataHttp.service';
import { ActivatedRoute } from '@angular/router';
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
  public provider_type: ProviderTypeEnum =
    this.route.snapshot.url[0].path.includes('organizers')
      ? ProviderTypeEnum.Organizer
      : ProviderTypeEnum.Activity;
  constructor(
    private dataHttpService: DataHttpService,
    private route: ActivatedRoute
  ) {
    this.trigger_change$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this.getData()),
        tap(() => this._loading$.next(false)),
        map((res) => {
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
    let pageProvider =
      this.provider_type == ProviderTypeEnum.Organizer
        ? ProviderPageEnum.PP_Organizar
        : ProviderPageEnum.PP_Activity;
    let params: PageRequestParams = {
      pageSize: this.pageSize,
      currentPageIndex: this.pageIndex - 1,
      properties: '*',
    };
    return this.dataHttpService.getData(pageProvider, params);
  }
  private exctractEntriesFromResponse(res: any) {
    let entries: EntryType[] = res.entries.map((e: any) => ({
      uid: e.uid,
      name: e.properties['organizer:name'],
      website: e.properties['organizer:website'],
      creation_data: e.properties['dc:created'],
      modified_date: e.properties['dc:modified'],
      creator: e.properties['dc:creator'],
    }));
    return entries;
  }
}
