import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsAgentPage } from './tickets-agent.page';

describe('TicketsAgentPage', () => {
  let component: TicketsAgentPage;
  let fixture: ComponentFixture<TicketsAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
