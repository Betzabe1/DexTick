import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeAgentPage } from './home-agent.page';

describe('HomeAgentPage', () => {
  let component: HomeAgentPage;
  let fixture: ComponentFixture<HomeAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
