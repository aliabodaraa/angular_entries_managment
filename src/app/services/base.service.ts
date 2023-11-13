import { Injectable } from '@angular/core';
import { EntryType } from '../models/app_data_state';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T extends EntryType> {
  constructor() {}

  //storage
  public getEntryInfo() {
    let pure_entry = localStorage.getItem('entry');
    if (pure_entry) {
      let entry = JSON.parse(pure_entry) as T;
      return entry;
    }
    return null;
  }
  public storgeEntryInfo(entry: T) {
    localStorage.setItem('entry', JSON.stringify(entry));
  }
}
