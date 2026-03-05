import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Person } from './person.model';

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    constructor() { }

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
        const persons: Person[] = [
            {
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
            },
            {
                id: 2,
                name: 'Jane',
                lastName: 'Smith',
                age: 28,
                email: 'jane@example.com',
                gender: 'female',
                wealth: 'rich',
                address: {
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    postalCode: '90001'
                }
            },
            {
                id: 3,
                name: 'Bob',
                lastName: 'Johnson',
                age: 35,
                email: 'bob@example.com',
                gender: 'male',
                wealth: 'poor',
                address: {
                    street: '789 Pine Rd',
                    city: 'Chicago',
                    postalCode: '60601'
                }
            }
        ];

        return of(persons);
    }

    save(person: Person): void {
        console.log('Person saved:', person);
    }

    checkMailExists(email: string): Observable<boolean> {
        // Simulate async mail check - return false (mail doesn't exist) after delay
        return of(false).pipe(
            // delay(1000)
        );
    }
}
