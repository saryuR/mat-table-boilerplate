import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { userData } from 'src/app/_interface/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userData: userData;
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getById(this.accountService.userSubject.value.UserId).subscribe(response => {
      this.userData = response;
      localStorage.setItem('currentLoggedInUser', JSON.stringify(response));
    });
  }

  public executeSelectedChange = (event) => {
    console.log(event);
  }
}
