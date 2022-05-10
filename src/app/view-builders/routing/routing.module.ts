import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../../views/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'users', loadChildren: () => import('../../views/users/user.module').then(m => m.UserModule)},
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
