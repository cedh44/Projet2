import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject({} as Olympic[]); //BehaviorSubject : retourne la dernière valeur de son état

  constructor(private http: HttpClient) {}

  // Chargement des données du fichier json
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)), //Next sert à faire émettre l'objet
      catchError((error) => { //Message d'erreur ci dessous
        alert(`Une erreur est survenue. Veuillez indiquer cette erreur au support: ${error.message}`);
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Récupération de l'observable
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  // Récupération des pays
  getCountries(olympics: Olympic[]): string[]{
    return olympics.map(olympics => olympics.country);
  }

  // Récupération du total des médailles (par pays)
  getTotalOfMedals(olympics: Olympic[]): number[]{  
    return olympics
    .map(olympic => {
      return olympic.participations.reduce((accumulator,participation) => accumulator + participation.medalsCount,0)
    });
  }

  // Récupération du total de participations (pour tous les pays)
  getMaxParticipations(olympics : Olympic[]): number{
    return Math.max(...(olympics.map(olympic => 
      olympic.participations).map(participation => participation.length))); 
  }

  // Récupération du pays
  getCountryByIdCountry(olympics : Olympic[], id: number): string{
    return olympics[id].country;
  }

  // Récupération du nombre de participations par pays
  getNumberOfEntriesByIdCountry(olympics : Olympic[], id: number): number{
    return olympics[id].participations.length;
  }
  
  // Récupération du nombre de médailles cumulées par pays
  getTotalNumberOfMedalsByIdCountry(olympics : Olympic[], id: number): number{
    return olympics[id].participations.reduce((accumulator,participation) => accumulator + participation.medalsCount,0);
  }

  // Récupération du nombre d'athlètes cumulés par pays
  getTotalNumberOfAthletesByIdCountry(olympics : Olympic[], id: number): number{
    return olympics[id].participations.reduce((accumulator,participation) => accumulator + participation.athleteCount,0);
  }

  // Récupération des années de participation par pays
  getYearsByIdCountry(olympics : Olympic[], id: number): number[]{
    return olympics[id].participations.map(participation => participation.year);
  }

  // Récupération du nimbre de médailles par pays par années
  getMedalsByIdCountry(olympics : Olympic[], id: number): number[]{
    return olympics[id].participations.map(participation => participation.medalsCount);
  }
}
