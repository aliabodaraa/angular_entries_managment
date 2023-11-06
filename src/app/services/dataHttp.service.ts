import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CreationIdentifiersEnum,
  EditionIdentifiersEnum,
  EntryType,
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
  createEntry(
    entry: Partial<EntryType>,
    creation_identifier: CreationIdentifiersEnum = CreationIdentifiersEnum.Organizer
  ) {
    let data = {
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
  getEntry(entryId: string) {
    return this.http.get<EntryType>('/organizers/' + entryId);
  }
  updateEntry(
    entry_content: Partial<EntryType>,
    entry_id: string,
    edition_identifier: EditionIdentifiersEnum = EditionIdentifiersEnum.Organizer
  ) {
    let data = {
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
}
