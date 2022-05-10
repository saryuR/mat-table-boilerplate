import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { MaterialModule } from './shared/material/material.module';
import { RoutingModule } from './view-builders/routing/routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LayoutComponent } from './view-builders/layout/layout.component';
import { HeaderComponent } from './view-builders/navigation/header/header.component';
import { SidenavListComponent } from './view-builders/navigation/sidenav-list/sidenav-list.component';
import { AlertComponent } from './shared/alert/alert.component';

const mainComponents = [
  AppComponent,
  LayoutComponent,
  HomeComponent,
  HeaderComponent,
  SidenavListComponent,
  AlertComponent];
@NgModule({
  declarations: [
    ...mainComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    RoutingModule,
    HttpClientModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
