import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OrganizersComponent } from './organizers/organizers.component';
import { OrganizerFormComponent } from './organizer-form/organizer-form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ActivitiesComponent } from './activities/activities.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import {
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DecimalPipe } from '@angular/common';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { AuthGuard } from './guard/auth.guard';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { ConfigInitService } from './init/config-init.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TableComponent } from './table/table.component';
import { FormComponent } from './form/form.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
const routes: Routes = [
  //Guests Routes
  { path: '', component: OrganizersComponent, canActivate: [AuthGuard] },

  { path: 'organizers/new', component: FormComponent },
  // { path: 'organizers/:id', component: FormComponent },
  {
    path: 'organizers/edit',
    component: FormComponent,
    data: {},
  },
  {
    path: 'organizers',
    component: OrganizersComponent,
    canActivate: [AuthGuard],
  },
  { path: 'activities/new', component: FormComponent },
  // { path: 'activities/:id', component: ActivityFormComponent },
  {
    path: 'activities/edit',
    component: FormComponent,
    data: {},
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', component: NotFoundComponent },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    BsNavbarComponent,
    AppComponent,
    OrganizersComponent,
    OrganizerFormComponent,
    ActivityFormComponent,
    ActivitiesComponent,
    SideBarComponent,
    TableComponent,
    FormComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    HttpClientModule,
    KeycloakAngularModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    DecimalPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigInitService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
