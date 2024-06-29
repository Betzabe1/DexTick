import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarAgentsPage } from './editar-agents.page';

describe('EditarAgentsPage', () => {
  let component: EditarAgentsPage;
  let fixture: ComponentFixture<EditarAgentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAgentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
