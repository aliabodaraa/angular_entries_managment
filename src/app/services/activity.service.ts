import { Injectable } from '@angular/core';
import { DataHttpService } from './dataHttp.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private dataHttpService: DataHttpService) {}

  // getData(pageSize: number, currentPageIndex: number) {
  //   return this.dataHttpService.getData(ProviderPageEnum.PP_Activity, {
  //     pageSize: pageSize,
  //     currentPageIndex: currentPageIndex,
  //     properties: '*',
  //   });
  // }
}
