import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { SidemenuComponent } from './shared/sidemenu/sidemenu.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { CenteredDirective } from './shared/formatting/formatting-directives';

@NgModule({ declarations: [
        AppComponent,
        NavbarComponent,
        SidemenuComponent,
        MainComponent,
        HomeComponent,
        AboutComponent,
        LoadingComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        CenteredDirective], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
