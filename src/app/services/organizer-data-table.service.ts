import { Injectable } from '@angular/core';
import { ORGANIZERS } from '../models/organizer';
import { AbstractTableDataService } from './abstract-data-table.service';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrganizerDataTableService extends AbstractTableDataService {
  private s: any;
  constructor(pipe: DecimalPipe, http: HttpClient) {
    super(ORGANIZERS, pipe, http);
  }
}
