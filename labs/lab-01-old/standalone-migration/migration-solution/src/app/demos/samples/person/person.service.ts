import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Person } from './person.model';
import { delay } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private http: HttpClient) { }

  getPersons() {
    return this.http.get<Person[]>(`${environment.api}persons`);
  }

  getPerson() {
    return this.http.get<Person>(`${environment.api}persons/1`);
  }

  save(form: NgForm) {
    console.log('ngForm:', form);
  }

  checkMailExists(email: string): Observable<boolean> {
    //Mocking Http Call to service to check weather user exists
    const exists = email === 'alexander.kastil@integrations.at';
    return of(exists).pipe(delay(500));
  }
}
