import { Injectable } from '@angular/core';
import { DataHttpService } from './dataHttp.service';
import { ProviderPageEnum } from '../models/data-request-api';

@Injectable({
  providedIn: 'root',
})
export class OrganizerService {
  constructor(private dataHttpService: DataHttpService) {}

  // getData(pageSize: number, currentPageIndex: number) {
  //   return this.dataHttpService.getData(PageProviderEnum.PP_Organizar, {
  //     pageSize: pageSize,
  //     currentPageIndex: currentPageIndex,
  //     properties: '*',
  //   });
  // }
}
