import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Person } from '../testt/testt.component';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  postUserDetails(person: Person): Observable<Person> {
    return this.http.post<Person>(
      'https://putsreq.com/aEJaJyGeFRl7vzOj00sb',
      person
    );
    //return of(person)
  }
}
