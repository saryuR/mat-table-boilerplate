import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../../shared/material/material.module';
import { UsersRoutingModule } from './user-routing/user-routing.module';

import { UserListComponent } from './user-list/user-list.component';
import { AddEditComponent } from './add-update-user/add-edit.component';

const components = [
  UserListComponent,
  AddEditComponent
];

@NgModule({
  declarations: [ ...components ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
