import { EntryType } from './data-request-api';
import { EntryItem } from './entryItem';

export class Entry implements EntryType {
  entryItems: EntryItem[] = [];
  uid = '';
  'dc:created' = '';
  'dc:modified' = '';
  'dc:creator' = '';
  constructor(private current_entry: EntryType) {
    console.log(this);
  }
}
