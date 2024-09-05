import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketAdminPage } from './ticket-admin.page';

describe('TicketAdminPage', () => {
  let component: TicketAdminPage;
  let fixture: ComponentFixture<TicketAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
