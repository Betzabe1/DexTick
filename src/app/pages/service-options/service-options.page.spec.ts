import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceOptionsPage } from './service-options.page';

describe('ServiceOptionsPage', () => {
  let component: ServiceOptionsPage;
  let fixture: ComponentFixture<ServiceOptionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
