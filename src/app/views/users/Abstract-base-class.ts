import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AccountService } from '../../shared/services/account.service';

@Injectable()
export abstract class AbstractBaseClassComponent implements OnDestroy {
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public displayedColumns = ['id', 'name', 'age', 'work', 'email', 'city', 'address', 'update', 'delete'];
  pageNumber = 0;
  pageSize = 6;
  adminRoleId = 3;
  accountService: AccountService;

  constructor() { }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
