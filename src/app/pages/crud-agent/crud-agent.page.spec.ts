import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudAgentPage } from './crud-agent.page';

describe('CrudAgentPage', () => {
  let component: CrudAgentPage;
  let fixture: ComponentFixture<CrudAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
