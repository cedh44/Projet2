import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-country',
  templateUrl: './detail-country.component.html',
  styleUrls: ['./detail-country.component.scss']
})
export class DetailCountryComponent implements OnInit {
  public olympics: Olympic[] = [];
  // Pour le subscribe/unsubsribe
  private destroy$!: Subject<boolean>;
  private countrySelected!: number;

  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.countrySelected = +this.route.snapshot.params['id'];
    console.log(`id country récupéré ${this.countrySelected}`);

    this.olympicService.getOlympics().pipe(
      takeUntil(this.destroy$)
      ).subscribe(olympicsFromJson => {
        //console.log(`olympicsFromJson = ${olympicsFromJson}`);
        //if(olympicsFromJson != {}) this.olympics = olympicsFromJson; // solutionner ici
        this.olympics = olympicsFromJson;
    });
  }

}
