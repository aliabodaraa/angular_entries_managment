import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
declare function require(name: string): any;
const Nuxeo = require('nuxeo');
let nuxeo = new Nuxeo({
  baseURL: 'http://54.227.55.65/nuxeo',
  auth: {
    method: 'bearerToken',
    token: localStorage.getItem('token'),
  },
  headers: {
    properties: '*',
  },
});
@Injectable({
  providedIn: 'root',
})
export class UploadCoverService {
  constructor() {}
  // upload activity cover picture
  // uploadCover(file: any): Observable<any> {
  //   return from(
  //     nuxeo.batchUpload('/upload', { mode: 'no-cors' }).upload({ file })
  //   ).pipe(
  //     catchError((err) => {
  //       throw err;
  //     })
  //   );
  // }
  uploadCover(file: any): Observable<any> {
    const nuxeoBlob = new Nuxeo.Blob({
      content: file,
    });
    return from(nuxeo.batchUpload('/upload').upload(nuxeoBlob)).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
}
