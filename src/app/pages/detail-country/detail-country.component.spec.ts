import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCountryComponent } from './detail-country.component';

describe('DetailCountryComponent', () => {
  let component: DetailCountryComponent;
  let fixture: ComponentFixture<DetailCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCountryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
