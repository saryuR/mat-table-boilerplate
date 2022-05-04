import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { AddEditComponent } from '../add-update-user/add-edit.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'create-user', component: AddEditComponent },
  { path: 'edit/:id', component: AddEditComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class UsersRoutingModule { }
