import { InjectionToken, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Organizer } from '../models/organizer';
import { SortColumn, SortDirection } from '../organizers/soartable.directive';
import { Activity } from '../models/activity';
import { HttpClient } from '@angular/common/http';

type dataTypes = Organizer[] | Activity[];

interface SearchResult {
  data: dataTypes;
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  data: dataTypes,
  column: SortColumn,
  direction: string
): dataTypes {
  if (direction === '' || column === '') {
    return data;
  } else {
    return [...data].sort((a, b) => {
      const res = compare(a[column], b[column]); //here
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(
  ele_data: dataTypes[number],
  term: string,
  pipe: PipeTransform
) {
  return (
    ele_data.name.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(ele_data.area).includes(term) ||
    pipe.transform(ele_data.population).includes(term)
  );
}
type dataReturned = {
  pageIndex: number;
  pageSize: number;
  numberOfPages: number;
};
export class AbstractTableDataService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _total$ = new BehaviorSubject<number>(0);
  private _data$: BehaviorSubject<dataTypes>;
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(
    private _data: dataTypes,
    private pipe: DecimalPipe,
    private http: HttpClient
  ) {
    // this.http
    //   .get<dataReturned>(
    //     'http://54.227.55.65/nuxeo/api/v1/search/pp/PP_Organizar/execute'
    //   )
    //   .subscribe((data) => {
    //     this.pageSize = data.pageSize;
    //     this._total$.next(data.numberOfPages);
    //   });
    this._data$ = new BehaviorSubject<typeof _data>([]);
    // this._data$.next(_data);
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        console.log('SUBSCRIBE');
        this._data$.next(result.data);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get data$() {
    return this._data$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    //console.log('searchTermGet');
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    //console.log('searchTermSet');
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(s: SortDirection | undefined) {
    //edited
    let switchedValue: SortDirection =
      this._state.sortDirection == 'asc' ? 'desc' : 'asc';
    this._set({ sortDirection: switchedValue });
  }
  private _set(patch: Partial<State>) {
    //console.log('_set');
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { page, pageSize, searchTerm, sortColumn, sortDirection } =
      this._state;

    // 1. sort
    let data_sorted = sort(this._data, sortColumn, sortDirection);

    // 2. filter
    let data_filtered = data_sorted.filter((ele_data) =>
      matches(ele_data, searchTerm, this.pipe)
    );
    const total = data_filtered.length;

    // 3. paginate
    let data_paginated = data_filtered.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    return of({ data: data_paginated, total });
  }
}
