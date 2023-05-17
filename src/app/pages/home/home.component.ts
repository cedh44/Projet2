import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartOptions } from 'chart.js';
import { Participation } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics: Olympic[] = [];
  // Pour le subscribe/unsubsribe
  private destroy$!: Subject<boolean>;

  public numberOfJOs!: number;
  public numberOfCountries!: number;
  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels!: string[];
  public pieChartDatasets!: [ { data: number[] } ];
  public pieChartLegend!:boolean;
  public pieChartPlugins!: [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    //this.olympics$ = this.olympicService.getOlympics(); //Code originel
    this.configChart();
    
    this.olympicService.getOlympics().pipe(
      takeUntil(this.destroy$)
      ).subscribe(olympicsFromJson => {
        //if(olympicsFromJson != {}) this.olympics = olympicsFromJson; // solutionner ici
        this.olympics = olympicsFromJson;
        this.fillChart();
      });
  }

  // Initialise la config du chart pie
  configChart(): void{
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
  }

  // Ajoute les données du chart pie (labels et datas)
  fillChart(): void {
    this.pieChartLabels = this.getCountriesToDisplay();
    this.pieChartDatasets = this.getTotalOfMedals();
    this.numberOfCountries = this.olympics.length;
  }

  getCountriesToDisplay(): string[]{ 
    if(this.olympics != undefined) return this.olympics.map(olympic => olympic.country);
    else return [];
  }

  getTotalOfMedals(): any{
    //let medalsToDisplay = [{ data: [] }];
    // Pour chaque élément de olmpics, additioner participation.medalsCount
    //medalsToDisplay.push(50);
    //medalsToDisplay.push(96);
    //return medalsToDisplay;
    //return [ { data: [ 300, 500, 100 ] } ];
    return [{
      label: "🥇",
      data: [20, 40, 13, 35, 20, 38],
      backgroundColor: ['#8D6266', '#BCCAE4', '#C5DFEF', '#93819F', '#8EA0D6', '#714052']
   }]
  }

  ngOnDestroy(): void {
    //Unsubscribe de l'observable (éviter fuites mémoire)
    this.destroy$.next(true);
  }  
}
