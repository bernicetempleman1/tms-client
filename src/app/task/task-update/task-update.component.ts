/**
 * Author: Bernice Templeman
 * Date: 2 December 2024
 * File: task-update.ts
 * Description: Update task
 *
 */
//Reference: Krasso, R. (2024). Lean, MEAN, and Pragmatic: A Guide to Full-Stack JavaScript Development (page 155}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

//update task component
@Component({
  selector: 'app-task-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink,
    FormsModule],
  template: `
    <div class="task-update-page">
      <h1 class="task-update-page__title">Task Update</h1>
      <h4 class="task-update-page__subtitle">
        Update information about your selected task, including its priority and
        status.
      </h4>
      @if (errorMessage) {
      <div class="message message--error">{{ errorMessage }}</div>
      }
      <div class="task-update-page__card">
        <form [formGroup]="taskForm" class="task-update-page__form">
          <div class="task-update-page__form-group">
            <label
              for="title"
              class="task-update-page__form-label"
              title="Must be 3 or more characters and unique"
              >Task Title<span class="required">*</span></label
            >
            <input
              type="text"
              id="title"
              class="task-update-page__form-control"
              formControlName="title"
              required
              placeholder="Enter the title of the task: must be unique and have 3+ characters"
            />
          </div>

          <div class="task-update-page__form-group">
            <label
              for="status"
              class="task-update-page__form-label"
              title="Select a Status"
              >Task Status<span class="required">*</span></label
            >
            <select
              id="status"
              class="task-update-page__form-control"
              required
              formControlName="status"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="task-update-page__form-group">
            <label
              for="priority"
              class="task-update-page__form-label"
              title="Select a priority"
              >Task Priority<span class="required">*</span></label
            >
            <select
              id="priority"
              class="task-update-page__form-control"
              required
              formControlName="priority"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button
            type="submit"
            class="task-update-page__btn"
            (click)="onSubmit()"
            class="task-update-page__btn"
            value="Submit"
          >
            Save Changes
          </button>
        </form>
      </div>
      <br />
      <a class="task-update-page__link" routerLink="/tasks/update">Return</a>
    </div>
  `,
  styles: [
    `
      .task-update-page {
        max-width: 80%;
        margin: 0 auto;
        padding: 20px;
      }
      .task-update-page__title {
        text-align: center;
        color: #563d7c;
      }
      .task-update-page__subtitle {
        text-align: center;
        color: #563d7c;
        font-size: 0.9rem;
        font-style: italic;
        margin-bottom: 20px;
      }
      .task-update-page__card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-top: 20px;
      }
      .task-update-page__form {
        display: flex;
        flex-direction: column;
      }
      .task-update-page__form-group {
        margin-bottom: 15px;
      }
      .task-update-page__form-label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      .task-update-page__form-control {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .task-update-page__btn {
        padding: 10px 15px;
        background-color: #563d7c;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        align-self: flex-start;
      }
      .task-update-page__btn:hover {
        background-color: #452a63;
      }
      .task-update-page__link {
        color: #563d7c;
        text-decoration: none;
        display: block;
      }
      .task-update-page__link:hover {
        text-decoration: underline;
      }
      .task-update-page__table-row:hover {
        background-color: #6c757d;
        color: white;
      }
    `,
  ],
})

// export
export class TaskUpdateComponent {
  taskId: string;
  task: Task;
  errorMessage: string;
  allTasks: Task[] = [];
  tasks: Task[] = [];
  filterType: string = '';

  taskForm: FormGroup = this.fb.group({
    title: [
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ],

    priority: [null, Validators.required],
    status: [null, Validators.required],
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    this.taskId = this.route.snapshot.paramMap.get('taskId') || '';
    this.task = {} as Task;
    this.errorMessage = '';

    if (this.taskId === '') {
      this.router.navigate(['/tasks/update']);
      return;
    }

    // get tasks
    this.taskService.getTask(this.taskId).subscribe({
      next: (task: Task) => {
        this.task = task;
        this.taskForm.setValue({
          title: task.title,
          status: task.status,
          priority: task.priority,
        });
      },
    });
  }

  onSubmit() {
    // check if valid
    if (!this.taskForm.valid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    console.log('task-update: submit');
    if (this.taskForm.valid) {
      console.log('task-create: valid');

      // declare and set updateTaskDTO
      const updateTaskDTO = {
        title: this.taskForm.controls['title'].value,
        status: this.taskForm.controls['status'].value,
        priority: this.taskForm.controls['priority'].value,
      };

      console.log('Update Task DTO:', updateTaskDTO);

      // call task Service to update task
      this.taskService.updateTask(this.taskId, updateTaskDTO).subscribe({
        next: (result: any) => {
          console.log(`TaskId: ${result._id} ${result.message}`);
          this.router.navigate(['/tasks/update']);
        },
        error: (err: any) => {
          console.error('Error updating task', err);
        },
      });
    }
  }
}
