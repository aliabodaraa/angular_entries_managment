import { Injectable } from '@angular/core';
import { Organizer } from '../models/organizer';
import { Activity } from '../models/activity';
import { HttpClient } from '@angular/common/http';
import {
  PageRequestParams,
  PageProviderEnum,
  PageResponse,
} from '../models/data-request-api';

@Injectable({
  providedIn: 'root',
})
export class DataHttpService {
  constructor(private http: HttpClient) {}

  getData(pageProvider: PageProviderEnum, params: PageRequestParams) {
    return this.http.get<any>(
      `http://54.227.55.65/nuxeo/api/v1/search/pp/${pageProvider}/execute`,
      { params }
    );
  }
}
