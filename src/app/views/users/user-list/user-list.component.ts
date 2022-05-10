import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { users } from '../users';
import { USERDATA } from '../../../_interface/user.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AccountService } from 'src/app/shared/services/account.service';
import { AbstractBaseClassComponent } from '../Abstract-base-class';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends AbstractBaseClassComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource = new MatTableDataSource<USERDATA>();
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public accountService: AccountService,
    public alertService: AlertService) {
    super();
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (!storedUsers) {
      this.dataSource.data = users;
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      this.dataSource.data = storedUsers;
    }
    this.accountService.userListSubject.next(this.dataSource.data);
    this.loading = false;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public customSort = (event) => {
    this.dataSource.data.sort(
      (a, b) => {
        return event.direction === 'asc' ? a[event.active] - b[event.active] :
          (event.direction === 'desc' ? b[event.active] - a[event.active] : a[event.active] - b[event.active]);
      }
    );
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToUpdate = (element: USERDATA) => {
    this.router.navigate(['edit', element.id], { relativeTo: this.route });
  }

  public addUser() {
    this.router.navigate(['create-user'], { relativeTo: this.route });
  }


}
