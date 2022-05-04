import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_helpers';
import { HomeComponent } from '../../views/home/home.component';
 
const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'users', loadChildren: () => import ('../../views/users/user.module').then(m => m.UserModule), canActivate: [AuthGuard] }, 
  { path: 'account', loadChildren: () => import ('../../views/account/account.module').then(m => m.AccountModule) },
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
