import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AuthGuard } from '../guard/auth.guard';
import { EntryComponent } from '../entry/entry.component';
import { ActivitiesComponent } from '../activities/activities.component';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { OrganizersComponent } from '../organizers/organizers.component';
import { OrganizerFormComponent } from '../organizer-form/organizer-form.component';

const routes: Routes = [
  { path: '', component: OrganizersComponent, canActivate: [AuthGuard] },

  {
    path: 'organizers/new',
    component: OrganizerFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organizers/:id/edit',
    component: OrganizerFormComponent,
    data: {},
    canActivate: [AuthGuard],
  },
  {
    path: 'organizers',
    component: OrganizersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organizers/:id',
    component: EntryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activities/new',
    component: ActivityFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activities/:id/edit',
    component: ActivityFormComponent,
    data: {},
    canActivate: [AuthGuard],
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activities/:id',
    component: EntryComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
