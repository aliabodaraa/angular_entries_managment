import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CreationIdentifiersEnum,
  DeletionIdentifiersEnum,
  EditionIdentifiersEnum,
  PageRequestParams,
  ProviderPageEnum,
  isActivityDataModeEdition,
} from '../models/data-request-api';
import { EntryType } from '../models/app_data_state';
export type OrganizerDataMode = Partial<EntryType>;
export type ActivityDataModeCreation = { activity: Partial<EntryType> };
export type ActivityDataModeEdition = {
  properties: Partial<EntryType>;
};

export type GContent =
  | OrganizerDataMode
  | ActivityDataModeCreation
  | ActivityDataModeEdition;

type Data = {
  params?: ActivityDataModeEdition;
  context?: GContent;
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
    context: Data['context'] | Data['params'],
    input: Data['input'] = this.data.input
  ) {
    this.data.input = input;
    if (isActivityDataModeEdition(context as ActivityDataModeEdition))
      this.data.params = context as ActivityDataModeEdition;
    else this.data.context = context;
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
    entry_content: GContent
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
    entry_content: GContent,
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
