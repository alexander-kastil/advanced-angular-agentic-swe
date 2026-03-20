import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Person } from './person.model';

@Injectable({
    providedIn: 'root'
})
export class PersonService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api}persons`;

    getPerson(): Observable<Person> {
        const person: Person = {
            id: 1,
            name: 'John',
            lastName: 'Doe',
            age: 30,
            email: 'john@example.com',
            gender: 'male',
            wealth: 'middle_class',
            address: {
                street: '123 Main St',
                city: 'New York',
                postalCode: '10001'
            }
        };

        return of(person);
    }

    getPersons(): Observable<Person[]> {
        return this.http.get<Person[]>(this.apiUrl);
    }

    savePerson(person: Person): Observable<Person> {
        return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person);
    }

    save(person: Person): void {
        console.log('Person saved:', person);
    }

    checkMailExists(email: string): Observable<boolean> {
        return of(false);
    }
}
