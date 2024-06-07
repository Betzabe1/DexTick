import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilAgentPage } from './perfil-agent.page';

describe('PerfilAgentPage', () => {
  let component: PerfilAgentPage;
  let fixture: ComponentFixture<PerfilAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
