import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { OrganizersComponent } from './organizers/organizers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ActivitiesComponent } from './activities/activities.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import {
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTimeAdapter,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { ConfigInitService } from './init/config-init.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TableComponent } from './table/table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogComponent } from './dialog/dialog.component';
import { SlideNavComponent } from './slide-nav/slide-nav.component';
import { NgbTimeStringAdapter } from './NgbTimeStringAdapter';
import { EntryComponent } from './entry/entry.component';
import { OrganizerFormComponent } from './organizer-form/organizer-form.component';
import { BaseComponent } from './base/base.component';
import { RoutingModule } from './routing/routing.module';
import { MatComponentsModule } from './material/mat-components.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    BsNavbarComponent,
    AppComponent,
    OrganizersComponent,
    OrganizerFormComponent,
    ActivityFormComponent,
    ActivitiesComponent,
    TableComponent,
    DialogComponent,
    SlideNavComponent,
    EntryComponent,
    BaseComponent,
  ],
  imports: [
    CommonModule,
    RoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatComponentsModule,
    NgbModule,
    BrowserModule,
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
    NgSelectModule,
  ],
  providers: [
    DecimalPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigInitService],
    },
    { provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
