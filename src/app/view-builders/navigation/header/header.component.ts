import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../shared/services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  showNavigation = true;

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    // this.accountService.userSubject.subscribe(() => {
    //   this.setNavBar();
    // });
  }

  setNavBar() {
    // const user = this.accountService.userValue;
    // this.showNavigation = Object.keys(user).length === 0 ? false : true;
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
