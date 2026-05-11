import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('loads skills synchronously from the data service', () => {
    expect(component.skills.length).toBeGreaterThan(0);
    expect(component.categories.length).toBeGreaterThan(0);
  });

  it('filters skills by category', () => {
    component.filterByCategory('devops');
    expect(component.filteredSkills.every((s) => s.category === 'devops')).toBe(true);
    component.filterByCategory(null);
    expect(component.filteredSkills.length).toBe(component.skills.length);
  });
});
