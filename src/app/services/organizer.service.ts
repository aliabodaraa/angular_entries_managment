import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Organizer, ORGANIZERS } from '../models/organizer';
import { SortColumn, SortDirection } from '../organizers/soartable.directive';

interface SearchResult {
  organizers: Organizer[];
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
  organizers: Organizer[],
  column: SortColumn,
  direction: string
): Organizer[] {
  if (direction === '' || column === '') {
    return organizers;
  } else {
    return [...organizers].sort((a, b) => {
      const res = compare(a[column], b[column]); //here
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: Organizer, term: string, pipe: PipeTransform) {
  return (
    country.name.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(country.area).includes(term) ||
    pipe.transform(country.population).includes(term)
  );
}

@Injectable({
  providedIn: 'root',
})
export class OrganizerService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _organizers$ = new BehaviorSubject<Organizer[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private pipe: DecimalPipe) {
    console.log(
      this.organizersValue,
      this.organizers$,
      this._organizers$.next([]),
      this._organizers$.getValue()
    );
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._organizers$.next(result.organizers);
        this._total$.next(result.total);
      });

    this._search$.next();
  }
  get organizersValue() {
    return this._organizers$.getValue();
  }
  get organizers$() {
    return this._organizers$.asObservable();
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
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(s: SortDirection) {
    //edited
    let switchedValue: SortDirection =
      this._state.sortDirection == 'asc' ? 'desc' : 'asc';
    this._set({ sortDirection: switchedValue });
  }
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let organizers = sort(ORGANIZERS, sortColumn, sortDirection);

    // 2. filter
    organizers = organizers.filter((country) =>
      matches(country, searchTerm, this.pipe)
    );
    const total = organizers.length;

    // 3. paginate
    organizers = organizers.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    return of({ organizers, total });
  }
}
