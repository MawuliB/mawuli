import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationComponent } from './education.component';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('loads education + certifications synchronously', () => {
    expect(component.educationList.length).toBeGreaterThan(0);
    expect(component.certifications.length).toBeGreaterThan(0);
  });

  it('detects expired certs', () => {
    expect(
      component.isExpired({
        id: 'x',
        name: 'old',
        issuer: 'X',
        issuedDate: '2020-01-01',
        expiresDate: '2021-01-01',
        imageUrl: '',
        verifyUrl: '',
        category: 'other',
      })
    ).toBe(true);
  });
});
