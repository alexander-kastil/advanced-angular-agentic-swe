import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Person } from './person.model';

@Injectable({
    providedIn: 'root'
})
export class PersonService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api}persons`;

    getPersons(): Observable<Person[]> {
        return this.http.get<Person[]>(this.apiUrl);
    }

    savePerson(person: Person): Observable<Person> {
        return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person);
    }

    checkNameTaken(name: string): Observable<boolean> {
        return this.http
            .get<Person[]>(`${this.apiUrl}?name=${encodeURIComponent(name)}`)
            .pipe(map((persons) => persons.length > 0));
    }
}
