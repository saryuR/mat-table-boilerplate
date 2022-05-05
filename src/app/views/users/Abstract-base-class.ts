import { Injectable } from '@angular/core';
import { userData } from 'src/app/_interface/user.model';


@Injectable()
export abstract class AbstractBaseClassComponent {
  adminRoleId = 3;
  loggedinUser: userData;
  AccountId: number;
  constructor() {
    this.loggedinUser = this.getLoggedInUser();
    this.AccountId = this.loggedinUser.Accounts[0].AccountId;
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentLoggedInUser'));
}

public preparePayload(isUpdate: boolean, userData: any): any {
  let payload: any = {
      LoggedInRoleId: this.adminRoleId,
      AccountId: this.loggedinUser.Accounts[0].AccountId,
      Roles: userData.Roles,
      Email: userData.Email,
      Password: 'Test@123',
      ConfirmPassword: 'Test@123',
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      DisplayName: userData.FirstName + ' ' + userData.LastName,
      JobTitleId: userData.JobTitleId,
      Prefix: userData.Prefix,
      Departments: [userData.Departments],
      ReportsTo: userData.ReportsTo,
      Status: 'Active',
      LockoutEnabled: false,
      DataStateFlag: 'I'
  }
  if (!isUpdate) {
    payload.Id = userData.Id;
  }
  return payload;
}

}
