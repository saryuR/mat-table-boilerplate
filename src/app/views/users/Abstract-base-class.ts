import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { COMMON, PREFIX, ROLES, USERDATA } from '../../_interface/user.model';
import { AccountService } from '../../shared/services/account.service';

@Injectable()
export abstract class AbstractBaseClassComponent implements OnDestroy {
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public displayedColumns = ['id', 'name', 'age', 'work', 'email', 'city', 'address',  'update', 'delete'];
  pageNumber = 0;
  pageSize = 6;
  adminRoleId = 3;
  accountService: AccountService;

  constructor() {  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
