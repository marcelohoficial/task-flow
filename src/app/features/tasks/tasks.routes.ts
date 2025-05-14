import { Routes } from '@angular/router';
import { TasksLayoutComponent } from './tasks-layout/tasks-layout.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TasksLayoutComponent,
    children: [
      {
        path: '',
        component: TaskListComponent
      },
      {
        path: 'create',
        component: TaskFormComponent
      },
      {
        path: ':id',
        component: TaskDetailComponent
      },
      {
        path: ':id/edit',
        component: TaskFormComponent
      }
    ]
  }
];