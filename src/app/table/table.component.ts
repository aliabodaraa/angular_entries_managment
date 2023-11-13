import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProviderTypeEnum } from '../models/data-request-api';
import { EntryType } from '../models/app_data_state';
import { TableColumns } from '../models/table-inputs';
import { take, tap } from 'rxjs/operators';
import {
  ModeOperationType,
  OpertionEmitterType,
  PageRequestParams,
  State,
} from '../models/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnDestroy, OnInit {
  private should_trigger = false;
  private _loading$ = new BehaviorSubject<boolean>(true);
  private trigger_change$ = new Subject<void>();
  public _state!: State;
  @Input('paginater_state') paginater_state!: State;
  @Input('columns') columns!: TableColumns;
  @Output('operationEmitter') operationEmitter =
    new EventEmitter<OpertionEmitterType>();
  @Output('requestDataEmitter') requestDataEmitter =
    new EventEmitter<PageRequestParams>();
  private _data = new BehaviorSubject<EntryType[]>([]);
  @Input('data') set entries(value: EntryType[]) {
    this._data.next(value);
  }
  get entries() {
    return this._data.getValue();
  }
  constructor() {
    this.trigger_change$.subscribe(() => {
      this.getData();
      this._loading$.next(true);
    });
  }
  ngOnChanges(changes: any) {
    console.log('ngOnChanges', changes);

    let pre_paginator = changes?.paginater_state.previousValue;
    let post_paginator = changes?.paginater_state.currentValue;

    if (!pre_paginator && post_paginator) {
      this._state = post_paginator;
      console.log('this._state--------------------------------');
      if (this._state.pageSize >= this._state.totalSize)
        this._state.pageSize = Math.ceil(this._state.totalSize / 2);
    }
  }
  ngOnInit() {
    console.log(this.paginater_state, 'ngOnInit');

    // now we can subscribe to it, whenever input changes,
    // we will run our grouping logic
    // this._data.subscribe((x) => {
    //   //the benifit of using subjectBehaviouy, you wait the value until comes from parent
    //   console.log(x);
    // });
  }

  ngOnDestroy(): void {
    this.trigger_change$.unsubscribe();
  }
  get pageSize(): number {
    return this._state.pageSize;
  }
  set pageSize(pageSize: number) {
    this._state.pageSize = pageSize;
    console.log('setPageSize', this._state.pageSize);
    if (this.should_trigger) {
      this.trigger_change$.next();
    }
    this.should_trigger = true;
  }
  get pageIndex(): number {
    return this._state.pageIndex;
  }
  set pageIndex(pageIndex: number) {
    this._state.pageIndex = pageIndex;
    console.log('setPageIndex', this._state.pageIndex);
    if (this.should_trigger) {
      this.trigger_change$.next();
    }
    this.should_trigger = true;
  }
  get totalSize(): number {
    return this._state.totalSize;
  }
  set totalSize(totalSize: number) {
    console.log('settotalSize', this._state.totalSize);
    this._state.totalSize = totalSize;
  }
  get loading$() {
    return this._loading$.asObservable();
  }

  public callOperation(entry: EntryType, mode: ModeOperationType) {
    let operation_data_param_obj: OpertionEmitterType = {
      entry,
      mode,
    };
    this.operationEmitter.emit(operation_data_param_obj);
  }

  private getData() {
    let params: PageRequestParams = {
      pageSize: this.pageSize,
      currentPageIndex: this.pageIndex - 1,
      properties: '*',
    };
    this.requestDataEmitter.emit(params);
  }
  intoString(value: unknown | string) {
    return String(value);
  }
  counter(i: number) {
    return new Array(i);
  }
}
