import { Component, OnInit } from '@angular/core';
import { Subject, catchError, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartOptions } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics: Olympic[] = [];
  // Pour le subscribe/unsubsribe
  private destroy$!: Subject<boolean>;
  // Variables pour affichage des données dans le dashboard
  public numberOfJOs!: number;
  public numberOfCountries!: number;
  // Variables nécessaires pour le chart de type pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true
  };
  public pieChartLabels!: string[];
  public pieChartDatasets!: [{label: string,data: number[],backgroundColor: string[]}];
  public pieChartLegend!:boolean;
  public pieChartPlugins!: [];
  public urlDetail = "detailcountry";

  constructor(private olympicService: OlympicService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.configChart();
    
    // Récupération des données du fichier json (grâce à l'observable)
    this.olympicService.getOlympics().pipe(
      takeUntil(this.destroy$),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        alert(`Une erreur est survenue. Veuillez indiquer cette erreur au support: ${error}`);
        this.destroy$.next(true);
        this.router.navigateByUrl('**');
        return caught;
      })
      ).subscribe(olympicsFromJson => {
        if(Array.isArray(olympicsFromJson)){
          this.olympics = olympicsFromJson;
          // Alimentation du chart pie
          this.fillChart();
        }
      });
  }

  // Initialise la config du chart pie
  configChart(): void{
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
  }

  // Ajoute les données des labels et du chart pie (labels et datas)
  fillChart(): void {
    this.pieChartLabels = this.olympicService.getCountries(this.olympics);
    this.pieChartDatasets = this.getLabelDatasAndColorsToDisplay();
    this.numberOfCountries = this.olympics.length;
    this.numberOfJOs = this.olympicService.getMaxParticipations(this.olympics);
  }

  // Récupère les données à afficher dans le pie avec les couleurs
  getLabelDatasAndColorsToDisplay(): [{label: string,data: number[],backgroundColor: string[]}]{
    return [{
      label: "🥇",
      data: this.olympicService.getTotalOfMedals(this.olympics),
      backgroundColor: ['#8D6266', '#BCCAE4', '#C5DFEF', '#93819F', '#8EA0D6', '#714052']
   }]
  }

  // Lors du clic sur un pays dans le pie, redirection vers la page Détail
  public chartClicked(e:any):void {
    this.router.navigateByUrl(this.urlDetail+'/'+e.active[0].index);
  }

  ngOnDestroy(): void {
    // Unsubscribe de l'observable (éviter fuites mémoire)
    this.destroy$.next(true);
  }  
}
