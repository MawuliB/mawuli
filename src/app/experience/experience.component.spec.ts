import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceComponent } from './experience.component';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('loads experience entries synchronously', () => {
    expect(component.experiences.length).toBeGreaterThan(0);
    expect(component.isLoading).toBe(false);
  });

  it('flags current job correctly', () => {
    expect(component.isCurrentJob('Present')).toBe(true);
    expect(component.isCurrentJob('2024-12')).toBe(false);
  });
});
