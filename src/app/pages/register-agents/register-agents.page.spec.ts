import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterAgentsPage } from './register-agents.page';

describe('RegisterAgentsPage', () => {
  let component: RegisterAgentsPage;
  let fixture: ComponentFixture<RegisterAgentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAgentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
