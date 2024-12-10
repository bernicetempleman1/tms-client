// Developer: Meher Salim and Bernice Templeman
// File: task-list.component.ts
// Description: Display all tasks
// Credits: Lean, Mean, and Pragmatic - A Guide to Full-Stack JavaScript Development

import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { CommonModule } from '@angular/common';
import { Task } from '../task';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HighlightRecentDirective } from '../highlight-recent.directive'; // added by BT
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    HighlightRecentDirective,
    FormsModule,
  ],
  providers: [DatePipe],
  template: `
    <div class="task-page">
      <h1 class="task-page__title">Search Tasks</h1>

      <div class="task-page__filter-container">
        <input
          type="text"
          placeholder="Type here"
          [formControl]="textSearchControl"
          class="task-page__filter"
        />
      </div>

      <div class="task-page__filter-container">
        <select [(ngModel)]="filterPriority" class="task-page__filter">
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="button"
          (click)="filterTasksPriority()"
          value="Filter Tasks by Priority"
          class="task-page__filter-button"
        />
      </div>

      <div class="task-page__filter-container">
        <select [(ngModel)]="filterStatus" class="task-page__filter">
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="button"
          (click)="filterTasksStatus()"
          value="Filter Tasks by Status"
          class="task-page__filter-button"
        />
      </div>

      <div class="task-page__highlight-info">
        <p>
          Rows highlighted in green indicate tasks that were created within the
          last 30 days.
        </p>
      </div>

      <div
        *ngIf="serverMessage"
        [ngClass]="{
          'message-alert': serverMessageType === 'error',
          'message-success': serverMessageType === 'success'
        }"
      >
        {{ serverMessage }}
      </div>

      <div *ngIf="tasks && tasks.length > 0; else noTasks">
        <table class="task-page__table">
          <thead class="task-page__table-head">
            <tr class="task-page__table-row">
              <th class="task-page__table-header">Title</th>
              <th class="task-page__table-header">Status</th>
              <th class="task-page__table-header">Priority</th>
              <th class="task-page__table-header">Due Date</th>
              <th class="task-page__table-header">Project</th>
              <th class="task-page__table-header">Task Id</th>
            </tr>
          </thead>
          <tbody class="task-page__table-body">
            @for (task of tasks; track task) {
            <tr
              class="task-page__table-row"
              [appHighlightRecent]="task.dateCreated ?? ''"
            >
              <td class="task-page__table-cell">{{ task.title }}</td>
              <td class="task-page__table-cell">{{ task.status }}</td>
              <td class="task-page__table-cell">{{ task.priority }}</td>
              <td class="task-page__table-cell">
                {{ task.dueDate | date : 'short' }}
              </td>
              <td class="task-page__table-cell">{{ task.projectId }}</td>
              <td class="task-page__table-cell">{{ task._id }}</td>
            </tr>
            }
          </tbody>
        </table>
      </div>

      <ng-template #noTasks>
        <p class="task-search-page__no-tasks">No tasks found.</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .task-page {
        max-width: 80%;
        margin: 0 auto;
        padding: 20px;
      }
      .task-page__title {
        text-align: center;
        color: #563d7c;
      }
      .task-page__table {
        width: 100%;
        border-collapse: collapse;
      }
      .task-page__table-header {
        background-color: #ffe484;
        color: #000;
        border: 1px solid black;
        padding: 5px;
        text-align: left;
      }
      .task-page__table-cell {
        border: 1px solid black;
        padding: 5px;
        text-align: left;
      }
      .task-page__table-cell--functions {
        text-align: center;
      }
      .task-page__icon-link {
        cursor: pointer;
        color: #6c757d;
        text-decoration: none;
        margin: 0 5px;
      }
      .task-page__icon-link:hover {
        color: #000;
      }
      .task-page__no-tasks {
        text-align: center;
        color: #6c757d;
      }
      .task-page__button {
        background-color: #563d7c;
        color: #fff;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 10px 2px;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;
      }
      .task-page__button:hover {
        background-color: #6c757d;
      }
      .message-alert {
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid transparent;
        border-radius: 4px;
        color: #a94442;
        background-color: #f2dede;
        border-color: #ebccd1;
      }
      .message-success {
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid transparent;
        border-radius: 4px;
        color: #3c763d;
        background-color: #dff0d8;
        border-color: #d6e9c6;
      }
      .task-page__filter-container {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
      }
      .task-page__filter {
        flex: 1;
        padding: 0.5rem;
        margin-right: 0.5rem;
      }
      .task-page__filter-button {
        background-color: #563d7c;
        color: #fff;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 10px 2px;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;
      }
      .task-page__filter-button:hover {
        background-color: #6c757d;
      }
      .task-page__highlight-info {
        text-align: center;
        color: #6c757d;
        margin-bottom: 1rem;
      }
      .task-page__table-row:hover {
        background-color: #6c757d;
        color: white;
      }
    `,
  ],
})
export class TaskSearchComponent {
  textSearchControl = new FormControl('');
  allTasks: Task[] = [];
  tasks: Task[] = [];
  filterType: string = '';
  serverMessage: string | null = null;
  serverMessageType: 'success' | 'error' | null = null;
  filterPriority: string = ''; //added by BT
  filterStatus: string = ''; // added by BT

  constructor(private taskService: TaskService, private datePipe: DatePipe) {
    this.tasks = this.allTasks;

    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.allTasks = tasks;
        console.log(`Tasks: ${JSON.stringify(this.tasks)}`);
      },
      error: (err: any) => {
        console.error(`Error occurred while retrieving tasks: ${err}`);
        this.tasks = [];
      },
    });

    this.textSearchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((val) => this.filterTasks(val || ''));
  }

  //Filter
  filterTasks(title: string) {
    this.tasks = this.allTasks.filter((g) =>
      g.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // filter Tasks by Priority: BT
  filterTasksPriority() {
    if (this.filterPriority === '') {
      this.tasks = this.allTasks;
      return;
    }
    this.tasks = this.allTasks.filter(
      (task) => task.priority === this.filterPriority
    );
  }

  // filter Tasks by Status: BT
  filterTasksStatus() {
    if (this.filterStatus === '') {
      this.tasks = this.allTasks;
      return;
    }
    this.tasks = this.allTasks.filter(
      (task) => task.status === this.filterStatus
    );
  }

  // Message
  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.serverMessage = null;
      this.serverMessageType = null;
    }, 3000);
  }
}
