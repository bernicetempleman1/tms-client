/**
 * Author: Bernice Templeman
 * Date: 11 November 2024
 * File: project-list.component.ts
 * Description:  project menu
 *
 */
//Reference: Krasso, R. (2024). Lean, MEAN, and Pragmatic: A Guide to Full-Stack JavaScript Development (page 172

import { Component } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../project';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, map, of } from 'rxjs';
import { HighlightRecentDirective } from '../highlight-recent.directive';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    HighlightRecentDirective,
  ],

  template: `
    <div class="project-page">
      <h1 class="project-page__title">Project List</h1>

      <div class="project-page__highlight-info">
        <p>
          Rows highlighted in green indicate projects that were created within
          the last 30 days.
        </p>
      </div>

      @if (serverMessage) {
      <div
        [ngClass]="{
          'message-alert': serverMessageType === 'error',
          'message-success': serverMessageType === 'success'
        }"
      >
        {{ serverMessage }}
      </div>
      } @if (projects.length > 0) {
      <table class="project-page__table">
        <thead class="project-page__table-head">
          <tr class="project-page__table-row">
            <th class="project-page__table-header">Project ID</th>
            <th class="project-page__table-header">Name</th>
            <th class="project-page__table-header">Description</th>
            <th class="project-page__table-header">Start Date</th>
            <th class="project-page__table-header">End date</th>
            <th class="project-page__table-header">Date Created</th>
            <th class="project-page__table-header">Date Modified</th>
          </tr>
        </thead>
        <tbody class="project-page__table-body">
          @for (project of projects; track project) {
          <tr
            class="project-page__table-row"
            [appHighlightRecent]="project.dateCreated ?? ''"
          >
            <td class="project-page__table-cell">{{ project.projectId }}</td>
            <td class="project-page__table-cell">{{ project.name }}</td>
            <td class="project-page__table-cell">{{ project.description }}</td>
            <td class="project-page__table-cell">{{ project.startDate }}</td>
            <td class="project-page__table-cell">{{ project.endDate }}</td>
            <td class="project-page__table-cell">{{ project.dateCreated }}</td>
            <td class="project-page__table-cell">{{ project.dateModified }}</td>
          </tr>
          }
        </tbody>
      </table>
      } @else {
      <p class="project-page__no-projects">
        No projects found, consider adding one...
      </p>
      }
    </div>
  `,
  styles: [
    `
      .project-page {
        max-width: 80%;
        margin: 0 auto;
        padding: 20px;
      }
      .project-page__title {
        text-align: center;
        color: #563d7c;
      }
      .project-page__table {
        width: 100%;
        border-collapse: collapse;
      }
      .project-page__table-header {
        background-color: #ffe484;
        color: #000;
        border: 1px solid black;
        padding: 5px;
        text-align: left;
      }

      .project-page__table-cell {
        border: 1px solid black;
        padding: 5px;
        text-align: left;
      }
      .project-page__table-cell--functions {
        text-align: center;
      }
      .project-page__icon-link {
        cursor: pointer;
        color: #6c757d;
        text-decoration: none;
        margin: 0 5px;
      }
      .project-page__icon-link:hover {
        color: #000;
      }
      .project-page__no-projects {
        text-align: center;
        color: #6c757d;
      }
      .project-page__button {
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
      .project-page__button:hover {
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
      .project-page__search-container {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
      }
      .project-page__search {
        flex: 1;
        padding: 0.5rem;
        margin-right: 0.5rem;
      }
      .project-page__table-row:hover {
        background-color: #6c757d;
        color: white;
      }
    `,
  ],
})
export class ProjectListComponent {
  projects: Project[] = [];
  allProjects: Project[] = [];
  serverMessage: string | null = null;
  serverMessageType: 'success' | 'error' | null = null;

  txtSearchControl = new FormControl('');

  constructor(private projectService: ProjectService) {
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.allProjects = projects;
        console.log(`Projects: ${JSON.stringify(this.projects)}`);
      },
      error: (err: any) => {
        console.error(`Error occurred while retrieving projects: ${err}`);
      },
    });
  }

  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.serverMessage = null;
      this.serverMessageType = null;
    }, 3000);
  }
}
