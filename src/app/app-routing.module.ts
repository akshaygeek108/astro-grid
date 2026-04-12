import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MrituBhagComponent } from './mritu-bhag/mritu-bhag.component';
import { PlanetDurationComponent } from './planet-duration/planet-duration.component';
import { ChandraNavmanshaComponent } from './chandra-navmansha/chandra-navmansha.component';
import { DasamsHouseComponent } from './dasams-house/dasams-house.component';
import { KakshyaComponent } from './kakshya/kakshya.component';
import { AgeCalculatorComponent } from './age-calculator/age-calculator.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'mritu-bhag', component: MrituBhagComponent },
  { path: 'planet-duration', component: PlanetDurationComponent },
  { path: 'chandra-navmansha', component: ChandraNavmanshaComponent },
  { path: 'dasamsa-house', component: DasamsHouseComponent },
  {path:'kakshya',component:KakshyaComponent},
   {path:'age-calculator',component:AgeCalculatorComponent},
  
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
