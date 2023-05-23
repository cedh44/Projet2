import { Component, OnInit } from '@angular/core';
import { Subject, catchError, takeUntil, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-detail-country',
  templateUrl: './detail-country.component.html',
  styleUrls: ['./detail-country.component.scss']
})
export class DetailCountryComponent implements OnInit {
  public olympics: Olympic[] = [];
  // Pour le subscribe/unsubsribe
  private destroy$!: Subject<boolean>;

  private idCountrySelected!: number;
  public country!: string;
  public numberOfEntries!: number;
  public totalNumberOfMedals!: number;
  public totalNumberOfAthletes!: number;

  //Chart Line
  public lineChartData!: ChartConfiguration['data'];
  public lineChartOptions!: any;
  public lineChartType: ChartType = 'line';

  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.idCountrySelected = +this.route.snapshot.params['id'];
    
    this.olympicService.getOlympics().pipe(
      takeUntil(this.destroy$),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        alert(`Une erreur est survenue. Veuillez indiquer cette erreur au support: ${error}`);
        this.destroy$.next(true);
        //Redirection vers la page not found
        this.router.navigateByUrl('**');
        return caught;
      }),
      tap(olympicFromJson => {
        //Pas d'olympic retourné -> redirection vers la page not found
        if(olympicFromJson[this.idCountrySelected] === undefined) this.router.navigateByUrl('**');
      }
        
      )
      ).subscribe(olympicsFromJson => {
        this.olympics = olympicsFromJson;
        this.fillChart();
      });
  }

    // Ajoute les données des labels et du chart line (labels et datas)
    fillChart(): void {
      this.country = this.olympicService.getCountryByIdCountry(this.olympics, this.idCountrySelected);
      this.numberOfEntries = this.olympicService.getNumberOfEntriesByIdCountry(this.olympics, this.idCountrySelected);
      this.totalNumberOfMedals = this.olympicService.getTotalNumberOfMedalsByIdCountry(this.olympics, this.idCountrySelected);
      this.totalNumberOfAthletes = this.olympicService.getTotalNumberOfAthletesByIdCountry(this.olympics, this.idCountrySelected);
      //Chart Line
      this.lineChartData = {
        datasets: [
          {
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
        labels: this.olympicService.getYearsByIdCountry(this.olympics, this.idCountrySelected),
        };
        this.lineChartOptions = {
          elements: {
            line: {
              tension: 0,
            },
          },
          scales: {},
          plugins: {
            legend: { display: false },
            annotation: {
              annotations: [],
            },
          },
        };
    }

    onContinue(): void{
      this.router.navigateByUrl('');
    }

    ngOnDestroy(): void {
      //Unsubscribe de l'observable (éviter fuites mémoire)
      this.destroy$.next(true);
    } 
}
