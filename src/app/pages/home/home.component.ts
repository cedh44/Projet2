import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ArcElement, ChartEvent, ChartOptions } from 'chart.js';

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
    responsive: true
  };
  public pieChartLabels!: string[];
  public pieChartDatasets!: [{label: string,data: number[],backgroundColor: string[]}];
  public pieChartLegend!:boolean;
  public pieChartPlugins!: [];
  public urlDetail = "/details";

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.configChart();
    
    this.olympicService.getOlympics().pipe(
      takeUntil(this.destroy$)
      ).subscribe(olympicsFromJson => {
        //console.log(`olympicsFromJson = ${olympicsFromJson}`);
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
    this.pieChartLabels = this.olympicService.getCountries(this.olympics);
    this.pieChartDatasets = this.getLabelDatasAndColorsToDisplay();
    this.numberOfCountries = this.olympics.length;
    this.numberOfJOs = this.olympicService.getMaxParticipations(this.olympics);
  }

  getLabelDatasAndColorsToDisplay(): [{label: string,data: number[],backgroundColor: string[]}]{
    return [{
      label: "🥇",
      data: this.olympicService.getTotalOfMedals(this.olympics),
      backgroundColor: ['#8D6266', '#BCCAE4', '#C5DFEF', '#93819F', '#8EA0D6', '#714052']
   }]
  }

  public chartClicked(e:any):void {
    console.log(`redirection vers ${this.urlDetail}/${e.active[0].index}`)
  }

  ngOnDestroy(): void {
    //Unsubscribe de l'observable (éviter fuites mémoire)
    this.destroy$.next(true);
  }  
}
