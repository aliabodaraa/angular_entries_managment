import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscribable,
  Subscriber,
  Subscription,
} from 'rxjs';
import { OrganizerService } from '../services/organizer.service';
import { EntryType, PageResponse } from '../models/data-request-api';
import { ActivityService } from '../services/activity.service';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
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
  private _search$ = new ReplaySubject<void>(20);

  private _entries$ = new BehaviorSubject<any[]>([]);

  private currentService: OrganizerService | ActivityService;
  private _state: State = {
    pageIndex: 0,
    pageSize: 5,
    totalSize: 10,
  };
  constructor(
    private organizerService?: OrganizerService,
    private activityService?: ActivityService
  ) {
    this.currentService =
      this.organizerService instanceof OrganizerService
        ? (this.organizerService as OrganizerService)
        : (this.activityService as ActivityService);
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() =>
          this.currentService.getData(this.pageSize, this.pageIndex - 1)
        ),
        tap((res) => {
          this.totalSize = res.totalSize;
          this._loading$.next(false);
        }),
        map((res) => {
          let entries: EntryType[] = res.entries.map((e: any) => ({
            uid: e.uid,
            title: e.title,
            website: e.website,
            creation_data: e.properties['dc:created'],
            modified_date: e.properties['dc:modified'],
            creator: e.properties['dc:creator'],
          }));
          return {
            totalSize: res.totalSize as number,
            entries,
          };
        }),
        delay(200),
        tap((res) => {
          this.totalSize = res.totalSize;
          this._loading$.next(false);
        })
      )
      .subscribe((result) => {
        this._entries$.next(result.entries);
      });
    this._search$.next();
  }
  get pageSize(): number {
    return this._state.pageSize;
  }
  set pageSize(pageSize: number) {
    this._state.pageSize = pageSize;
    this._search$.next();
  }
  get pageIndex(): number {
    return this._state.pageIndex;
  }
  set pageIndex(pageIndex: number) {
    this._state.pageIndex = pageIndex;
    this._search$.next();
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
}
