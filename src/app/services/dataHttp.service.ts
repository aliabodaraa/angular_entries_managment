import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  PageRequestParams,
  ProviderPageEnum,
} from '../models/data-request-api';

@Injectable({
  providedIn: 'root',
})
export class DataHttpService {
  constructor(private http: HttpClient) {}

  getData(pageProvider: ProviderPageEnum, params: PageRequestParams) {
    return this.http.get<any>(
      `http://54.227.55.65/nuxeo/api/v1/search/pp/${pageProvider}/execute`,
      { params }
    );
  }
}
