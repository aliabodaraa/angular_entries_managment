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
  constructor(private http: HttpClient) {}

  getData(pageProvider: ProviderPageEnum, params: PageRequestParams) {
    return this.http.get<any>(
      `http://54.227.55.65/nuxeo/api/v1/search/pp/${pageProvider}/execute`,
      { params }
    );
  }
  createEntry(
    entry: Partial<EntryType>,
    creation_identifier: CreationIdentifiersEnum = CreationIdentifiersEnum.Organizer
  ) {
    let data: Data = {
      context: entry,
      input: '/',
    };
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http.post<any>(
      `http://54.227.55.65/nuxeo/api/v1/automation/${creation_identifier}`,
      JSON.stringify(data),
      { headers }
    );
  }
  updateEntry(
    entry_content: Partial<EntryType>,
    entry_id: string,
    edition_identifier: EditionIdentifiersEnum = EditionIdentifiersEnum.Organizer
  ) {
    let data: Data = {
      context: entry_content,
      input: entry_id,
    };
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http.post<any>(
      `http://54.227.55.65/nuxeo/api/v1/automation/${edition_identifier}`,
      JSON.stringify(data),
      { headers }
    );
  }
  deleteEntry(
    entry_id: string,
    deletion_identifier: DeletionIdentifiersEnum = DeletionIdentifiersEnum.Organizer
  ) {
    let data: Data = {
      input: entry_id,
    };
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http.post<any>(
      `http://54.227.55.65/nuxeo/api/v1/automation/${deletion_identifier}`,
      JSON.stringify(data),
      { headers }
    );
  }
}
