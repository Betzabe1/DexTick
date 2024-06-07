import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsUserPage } from './tickets-user.page';

describe('TicketsUserPage', () => {
  let component: TicketsUserPage;
  let fixture: ComponentFixture<TicketsUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
