import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarAdminsPage } from './editar-admins.page';

describe('EditarAdminsPage', () => {
  let component: EditarAdminsPage;
  let fixture: ComponentFixture<EditarAdminsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAdminsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
