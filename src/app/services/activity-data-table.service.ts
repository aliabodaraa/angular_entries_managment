import { Injectable } from '@angular/core';
import { ACTIVITIES } from '../models/activity';
import { AbstractTableDataService } from './abstract-data-table.service';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityDataTableService extends AbstractTableDataService {
  constructor(pipe: DecimalPipe, http: HttpClient) {
    super(ACTIVITIES, pipe, http);
  }
}
