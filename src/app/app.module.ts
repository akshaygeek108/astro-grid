import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from './app-routing.module';
import { MrituBhagComponent } from './mritu-bhag/mritu-bhag.component';
import { PlanetDurationComponent } from './planet-duration/planet-duration.component';
import { ChandraNavmanshaComponent } from './chandra-navmansha/chandra-navmansha.component';
import { DasamsHouseComponent } from './dasams-house/dasams-house.component';
import { MatTabsModule } from '@angular/material/tabs';
import { KakshyaComponent } from './kakshya/kakshya.component';
import { AgeCalculatorComponent } from './age-calculator/age-calculator.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
@NgModule({
  declarations: [AppComponent, HomeComponent, AboutComponent, MrituBhagComponent, PlanetDurationComponent, ChandraNavmanshaComponent, DasamsHouseComponent, KakshyaComponent, AgeCalculatorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSelectModule,
     MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    AppRoutingModule,MatTabsModule,MatNativeDateModule
  ],
  providers: [
  { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
