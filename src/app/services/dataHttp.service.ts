import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CreationIdentifiersEnum,
  DeletionIdentifiersEnum,
  EditionIdentifiersEnum,
  PageRequestParams,
  ProviderPageEnum,
} from '../models/data-request-api';
import { EntryType } from '../models/app_data_state';
type Data = {
  context?: Partial<EntryType>;
  input: string;
};
@Injectable({
  providedIn: 'root',
})
export class DataHttpService {
  data: Data = { input: '/' };
  headers = new HttpHeaders().set(
    'Content-Type',
    'application/json; charset=utf-8'
  );

  private setData(
    context: Data['context'],
    input: Data['input'] = this.data.input
  ) {
    this.data.input = input;
    this.data.context = context;
  }
  constructor(private http: HttpClient) {}

  getData(pageProvider: ProviderPageEnum, params: PageRequestParams) {
    return this.http.get<any>(
      `http://54.227.55.65/nuxeo/api/v1/search/pp/${pageProvider}/execute`,
      { params }
    );
  }
  createEntry(
    creation_identifier: CreationIdentifiersEnum,
    entry_content: Partial<EntryType>
  ) {
    this.setData(entry_content);
    return this.http.post<any>(
      `http://54.227.55.65/nuxeo/api/v1/automation/${creation_identifier}`,
      JSON.stringify(this.data),
      { headers: this.headers }
    );
  }
  updateEntry(
    edition_identifier: EditionIdentifiersEnum,
    entry_content: Partial<EntryType>,
    entry_id: string
  ) {
    this.setData(entry_content, entry_id);

    return this.http.post<any>(
      `http://54.227.55.65/nuxeo/api/v1/automation/${edition_identifier}`,
      JSON.stringify(this.data),
      { headers: this.headers }
    );
  }
  deleteEntry(
    entry_id: string,
    deletion_identifier: DeletionIdentifiersEnum = DeletionIdentifiersEnum.Organizer
  ) {
    this.setData({}, entry_id);

    return this.http.post<any>(
      `http://54.227.55.65/nuxeo/api/v1/automation/${deletion_identifier}`,
      JSON.stringify(this.data),
      { headers: this.headers }
    );
  }
}
