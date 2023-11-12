import { TableColumns } from '../models/table-inputs';

export const columns: TableColumns = {
  keys: [
    'organizer:name',
    'dc:creator',
    'organizer:website',
    'dc:created',
    'dc:modified',
  ],
  values: ['name', 'creator', 'website', 'created', 'modified'],
};
