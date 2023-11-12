import { Component, OnInit } from '@angular/core';
import { EntryService } from '../services/entry.service';
import {
  AddressType,
  EmailType,
  EntryType,
  OrganizeEntry,
  PhoneType,
  isActivityEntry,
  isOrganizerEntry,
} from '../models/app_data_state';
import { ActivatedRoute } from '@angular/router';
import { ProviderTypeEnum } from '../models/data-request-api';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css'],
})
export class EntryComponent implements OnInit {
  entry: EntryType | null;
  providerType!: ProviderTypeEnum;
  is_organizer: Boolean = true;
  data: any;
  constructor(
    private EntryService: EntryService,
    private route: ActivatedRoute
  ) {
    this.entry = this.EntryService.getEntryInfo();
    if (this.entry) this.is_organizer = isOrganizerEntry(this.entry) ?? false;
    this.data = this.entry;
    this.route.queryParamMap.pipe(take(1)).subscribe((queryParams) => {
      this.providerType = queryParams.get('provider_type')! as ProviderTypeEnum;
    });
  }

  ngOnInit(): void {
    console.log('providerType', this.providerType, 'entry', this.entry);
  }
}
