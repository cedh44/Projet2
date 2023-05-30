import { Component, OnInit } from '@angular/core';
import { Subject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-detail-country',
  templateUrl: './detail-country.component.html',
  styleUrls: ['./detail-country.component.scss']
})
export class DetailCountryComponent implements OnInit {
  public olympics: Olympic[] = [];
  // Pour le subscribe/unsubsribe
  private destroy$!: Subject<boolean>;
  // Id du country dans le tableau d'olympics
  private idCountrySelected!: number;
  // Variables pour affichage des données dans la page détail
  public country!: string;
  public numberOfEntries!: number;
  public totalNumberOfMedals!: number;
  public totalNumberOfAthletes!: number;

  // Variable pour le chart line
  public lineChartData!: ChartConfiguration['data'];
  public lineChartOptions!: any;
  public lineChartType: ChartType = 'line'; // Type de graphique line

  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    // Récupération de l'id du tableau des pays
    this.idCountrySelected = +this.route.snapshot.params['id'];
    
    // Récupération des données du fichier json (grâce à l'observable)
    this.olympicService.getOlympics().pipe(
      takeUntil(this.destroy$),
      tap(olympicFromJson => {
        // Pas d'olympic retourné -> redirection vers la page not found
        if(olympicFromJson[this.idCountrySelected] === undefined) this.router.navigateByUrl('**');
      }))
      .subscribe(olympicsFromJson => {
        this.olympics = olympicsFromJson;
        //Alimentation du chart line
        this.fillChart();
      });
  }

    // Ajoute les données des labels et du chart line (labels et datas)
    fillChart(): void {
      this.country = this.olympicService.getCountryByIdCountry(this.olympics, this.idCountrySelected);
      this.numberOfEntries = this.olympicService.getNumberOfEntriesByIdCountry(this.olympics, this.idCountrySelected);
      this.totalNumberOfMedals = this.olympicService.getTotalNumberOfMedalsByIdCountry(this.olympics, this.idCountrySelected);
      this.totalNumberOfAthletes = this.olympicService.getTotalNumberOfAthletesByIdCountry(this.olympics, this.idCountrySelected);
      // chart line
      this.lineChartData = {
        datasets: [
          {
            // Données de l'axe Y du chart line
            data: this.olympicService.getMedalsByIdCountry(this.olympics, this.idCountrySelected),
            label: this.country,
            backgroundColor: 'rgba(57,129,141,0.2)',
            borderColor: 'rgba(57,129,141,1)',
            pointBackgroundColor: 'rgba(57,129,141,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(57,129,141,0.8)',
            fill: 'origin',
          }],
        // Données de l'axe X du chart line
        labels: this.olympicService.getYearsByIdCountry(this.olympics, this.idCountrySelected),
        };
        this.lineChartOptions = {
          elements: {
            line: {
              tension: 0, //Pour la tension de la courbe, ici 0 pour avoir des lignes droites
            },
          },
          scales: {},
          plugins: {
            legend: { display: false }, //Affiche ou non la légende du graphique
            annotation: {
              annotations: [],
            },
          },
        };
    }

    // Retour vers le dashboard
    onContinue(): void{
      this.router.navigateByUrl('');
    }

    ngOnDestroy(): void {
      //Unsubscribe de l'observable (éviter fuites mémoire)
      this.destroy$.next(true);
    } 
}
