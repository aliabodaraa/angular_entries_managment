import { Injectable } from '@angular/core';
import { DataHttpService } from './dataHttp.service';
import { PageProviderEnum } from '../models/data-request-api';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private dataHttpService: DataHttpService) {}

  getData(pageSize: number, currentPageIndex: number) {
    return this.dataHttpService.getData(PageProviderEnum.PP_Activity, {
      pageSize: pageSize,
      currentPageIndex: currentPageIndex,
      properties: '*',
    });
  }
}
