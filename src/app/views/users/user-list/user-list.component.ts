import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from '../../../shared/services/users.service';
import { userData } from '../../../_interface/user.model';
import { users } from './users';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['firstName', 'lastName', 'email', 'walshrole', 'update', 'delete'];
  public dataSource = new MatTableDataSource<userData>();
  public users: userData[] = users;
  public isAdmin = false;
  public adminRoleId = 3;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageNumber = 0;
  pageSize = 2;
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router, private usersService: UsersService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  public getAllUsers = () => {
    this.loading = true;
    const currentLoggedInUser = this.getLoggedInUser();
    this.isAdmin = this.isAccountAdmin(currentLoggedInUser.Accounts[0].Roles);
    this.usersService.getData(currentLoggedInUser.Accounts[0].AccountId, this.pageNumber, this.pageSize)
      .subscribe((res: any) => {
        this.dataSource.data = res as userData[];
        this.loading = false;
      });
  }

  isAccountAdmin(roles) {
    const admin = roles.find(x => x.Id === this.adminRoleId);
    return admin ? true : false;
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentLoggedInUser'));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public customSort = (event) => {
    this.dataSource.data.sort(
      (a, b) => {
        return event.direction === 'asc' ? a[event.active] - b[event.active] : (event.direction === 'desc' ? b[event.active] - a[event.active] : a[event.active] - b[event.active]);
      }
    );

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToUpdate = (element: userData) => {
    this.router.navigate(['edit', element.Id], { relativeTo: this.route });
  }


  public addUser() {
    this.router.navigate(['create-user'], { relativeTo: this.route });
  }

  public markUserAsInActive = (element: userData) => {
    const payload: any = element;
    payload.Status = 'Active';
    payload.AccountId = payload.Accounts[0].AccountId;
    this.usersService.update('api/UserAccount/Update', payload).subscribe(response => {
      console.log('updated');
    });
  }

}
