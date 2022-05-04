import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  showNavigation = true;
  
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    const user = this.accountService.userValue;
        if (Object.keys(user).length === 0) {
          this.showNavigation = false;
        }
  }
  
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
