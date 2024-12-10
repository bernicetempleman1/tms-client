
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ProjectUpdateComponent } from './project-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProjectService } from '../project.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UpdateProjectDTO, Project } from '../project';

describe('ProjectUpdateComponent', () => {
  let component: ProjectUpdateComponent;
  let fixture: ComponentFixture<ProjectUpdateComponent>;
  let projectService: ProjectService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        ProjectUpdateComponent,
      ],
      providers: [
        ProjectService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectUpdateComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should display title "Project Update"', () => {
    //Assign DOM to variable
    const compiled = fixture.nativeElement;
    //Select HTML element
    const title = compiled.querySelector('h1');

    //Check text content of h1 element
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Project Update');
  });

   //should have a valid form when all fields are filled correctly
   it('should have a valid form when all fields are filled correctly', () => {
    component.projectForm.controls['name'].setValue('Test Plant');
    component.projectForm.controls['description'].setValue('High       ');

    expect(component.projectForm.valid).toBeTrue();
  });

  // should handle error on form submission failure
  it('should handle error on form submission failure', fakeAsync(() => {
    spyOn(projectService, 'updateProject').and.returnValue(
      throwError('Error updating project')
    );
    spyOn(console, 'error');
    component.projectForm.controls['name'].setValue('Test Plant');
    component.projectForm.controls['description'].setValue('High      ');
    component.onSubmit();
    tick();
    expect(projectService.updateProject).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating project',
      'Error updating project'
    );
  }));
});

