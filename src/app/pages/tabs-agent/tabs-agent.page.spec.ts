import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsAgentPage } from './tabs-agent.page';

describe('TabsAgentPage', () => {
  let component: TabsAgentPage;
  let fixture: ComponentFixture<TabsAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
