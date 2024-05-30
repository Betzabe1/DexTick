import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeAgentePage } from './home-agente.page';

describe('HomeAgentePage', () => {
  let component: HomeAgentePage;
  let fixture: ComponentFixture<HomeAgentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAgentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
