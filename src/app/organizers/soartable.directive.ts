import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Organizer } from '../models/organizer';
import { Activity } from '../models/activity';

export type SortColumn = keyof Organizer | keyof Activity | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEvent {
  column: SortColumn;
  direction?: SortDirection;
}

@Directive({
  selector: 'sortable',
  //   standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = 'desc';
  @Output() sort = new EventEmitter<SortEvent>();
  constructor() {
    console.log('Rotat');
  }
  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
