import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //public olympics$: Observable<any> = of(null); // code originel
  //public olympics$!: Observable<Olympic[]>;
  public olympics!: Olympic[];
  private destroy$!: Subject<boolean>;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();

    this.olympicService.getOlympics().pipe(
      takeUntil(this.destroy$)
      ).subscribe(olympicsFromJson => {
        this.olympics = olympicsFromJson;
        console.log(olympicsFromJson);
      });
  }

  ngOnDestroy(): void {
    //Unsubscribe de l'observable (éviter fuites mémoire)
    this.destroy$.next(true);
  }  
}
