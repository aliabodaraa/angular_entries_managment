import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OrganizersComponent } from './organizers/organizers.component';
import { OrganizerFormComponent } from './organizer-form/organizer-form.component';
import { HomeComponent } from './home/home.component';
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
// const checkUserLoggingStatus = (
//   routeTo: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   return inject(AuthGuard).canActivate(state.url);
// };
// const checkUserIsAdmin = () => {
//   return inject(AdminAuthGuard).canActivate();
// };
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
const routes: Routes = [
  //Guests Routes
  { path: '', component: OrganizersComponent },

  { path: 'organizers/new', component: OrganizerFormComponent },
  { path: 'organizers/:id', component: OrganizerFormComponent },
  {
    path: 'organizers',
    component: OrganizersComponent,
    canActivate: [AuthGuard],
  },
  { path: 'activities/new', component: ActivityFormComponent },
  { path: 'activities/:id', component: ActivityFormComponent },
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
    HomeComponent,
    OrganizersComponent,
    OrganizerFormComponent,
    ActivityFormComponent,
    ActivitiesComponent,
    SideBarComponent,
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
