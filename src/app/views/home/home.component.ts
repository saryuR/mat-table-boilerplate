import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { USERDATA } from '../../_interface/user.model';
import { AccountService } from '../../shared/services/account.service';
import { AbstractBaseClassComponent } from '../users/Abstract-base-class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userData: USERDATA;
  constructor(public accountService: AccountService) { }

  ngOnInit() {
    // this.accountService.getById(this.accountService.userSubject.value.id)
    //   .subscribe(response => {
    //     this.userData = response;
    //     localStorage.setItem('currentLoggedInUser', JSON.stringify(response));
    //   });
  }

}
