import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CreationIdentifiersEnum,
  DeletionIdentifiersEnum,
  EditionIdentifiersEnum,
  EntryType,
  PageRequestParams,
  ProviderPageEnum,
} from '../models/data-request-api';
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
    entry_content: Partial<EntryType>,
    creation_identifier: CreationIdentifiersEnum = CreationIdentifiersEnum.Organizer
  ) {
    this.setData(entry_content);
    return this.http.post<any>(
      `http://54.227.55.65/nuxeo/api/v1/automation/${creation_identifier}`,
      JSON.stringify(this.data),
      { headers: this.headers }
    );
  }
  updateEntry(
    entry_content: Partial<EntryType>,
    entry_id: string,
    edition_identifier: EditionIdentifiersEnum = EditionIdentifiersEnum.Organizer
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
