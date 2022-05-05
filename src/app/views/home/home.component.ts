import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { userData } from '../../_interface/user.model';
import { AccountService } from 'src/app/shared/services/account.service';
import { AbstractBaseClassComponent } from '../users/Abstract-base-class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends AbstractBaseClassComponent implements OnInit, OnDestroy {
  public userData: userData;
  constructor(public accountService: AccountService) {
    super();
  }

  ngOnInit(): void {
    this.accountService.getById(this.accountService.userSubject.value.UserId)
      .pipe(takeUntil(this.destroyed$)).subscribe(response => {
        this.userData = response;
        localStorage.setItem('currentLoggedInUser', JSON.stringify(response));
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
