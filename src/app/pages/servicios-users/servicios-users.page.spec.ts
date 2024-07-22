import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosUsersPage } from './servicios-users.page';

describe('ServiciosUsersPage', () => {
  let component: ServiciosUsersPage;
  let fixture: ComponentFixture<ServiciosUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
