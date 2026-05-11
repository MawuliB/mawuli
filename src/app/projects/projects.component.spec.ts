import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('loads projects synchronously', () => {
    expect(component.projects.length).toBeGreaterThan(0);
    expect(component.filteredProjects.length).toBe(component.projects.length);
  });

  it('filters projects locally without re-subscribing', () => {
    const featuredCount = component.projects.filter((p) => p.featured).length;
    component.filterProjects('featured');
    expect(component.filteredProjects.length).toBe(featuredCount);
    component.filterProjects('all');
    expect(component.filteredProjects.length).toBe(component.projects.length);
  });

  it('opens and closes the modal', () => {
    expect(component.selectedProject).toBeNull();
    component.openProjectDetails(component.projects[0]);
    expect(component.selectedProject).toBe(component.projects[0]);
    component.closeProjectDetails();
    expect(component.selectedProject).toBeNull();
  });
});
