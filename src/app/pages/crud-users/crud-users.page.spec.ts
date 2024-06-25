import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudUsersPage } from './crud-users.page';

describe('CrudUsersPage', () => {
  let component: CrudUsersPage;
  let fixture: ComponentFixture<CrudUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
