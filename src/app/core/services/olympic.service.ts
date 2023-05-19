import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject({} as Olympic[]); //BehaviorSubject : retourne la dernière valeur de son état

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)), //next sert à faire émettre l'objet
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next({} as Olympic[]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getCountries(olympics: Olympic[]): string[]{
    if(olympics != undefined) return olympics.map(olympics => olympics.country);
    else return [];
  }

  getTotalOfMedals(olympics: Olympic[]): number[]{  
    return olympics
    .map(olympic => {
      return olympic.participations.reduce((accumulator,participation) => accumulator + participation.medalsCount,0)
    });
  }
  
}
