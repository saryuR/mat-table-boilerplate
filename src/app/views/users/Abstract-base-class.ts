import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from '../../shared/services/account.service';
import { common, Prefix, roles, userData } from '../../_interface/user.model';


@Injectable()
export abstract class AbstractBaseClassComponent implements OnDestroy{
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public displayedColumns = ['firstName', 'lastName', 'email', 'walshrole', 'update', 'delete'];
  pageNumber = 0;
  pageSize = 2;
  adminRoleId = 3;
  loggedinUser: userData;
  AccountId: number;
  isAdmin = false;
  roleTypes: roles[];
  prefixs: Prefix[];
  localJobTitles: common[];
  localDepartment: common[];
  reportsTo: common[];
  accountService: AccountService;

  constructor() {
    this.loggedinUser = this.getLoggedInUser();
    this.AccountId = this.loggedinUser.Accounts[0].AccountId;
    this.isAdmin = this.isAccountAdmin(this.loggedinUser.Accounts[0].Roles);
  }

  public isAccountAdmin(roles): boolean {
    const admin = roles.find(x => x.Id === this.adminRoleId);
    return admin ? true : false;
  }


  public getLoggedInUser(): userData {
    return JSON.parse(localStorage.getItem('currentLoggedInUser'));
  }

  public preparePayload(isUpdate: boolean, userData: any, isInActive?: boolean): any {
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
      PhoneNumber: userData.PhoneNumber,
      JobTitleId: userData.JobTitleId,
      Prefix: userData.Prefix,
      Departments: [userData.Departments],
      ReportsTo: userData.ReportsTo,
      Status: 'Active',
      LockoutEnabled: false,
      DataStateFlag: 'I'
    }
    if (isUpdate) {
      payload.Id = userData.Id;
      payload.UserId = userData.UserId;
    }
    if (isInActive) {
      payload.Status = 'I';
    }
    return payload;
  }

  public initUserDetails(): void {
    const Prefix$ = this.accountService.getUserPrefix();
    const LocalJobTitles$ = this.accountService.getLocalJobTitles(this.AccountId);
    const LocalDepartment$ = this.accountService.getLocalDepartment(this.AccountId);
    const ReportsTo$ = this.accountService.getReportsTo(this.AccountId);
    const roles$ = this.accountService.getRoles(this.loggedinUser.UserId, this.AccountId)

    forkJoin({ Prefix$, LocalJobTitles$, LocalDepartment$, ReportsTo$, roles$ })
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.prefixs = res.Prefix$;
        this.localJobTitles = res.LocalJobTitles$;
        this.localDepartment = res.LocalDepartment$;
        this.reportsTo = res.ReportsTo$;
        this.roleTypes = res.roles$;
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}
