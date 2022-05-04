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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  constructor(private route:ActivatedRoute, private router: Router,private usersService: UsersService) { }
 
  ngOnInit() {
    this.getAllUsers();
  }
 
  public getAllUsers = () => {
    this.dataSource.data = this.users;
    // this.usersService.getData('api/owner')
    // .subscribe(res => {
    //   this.dataSource.data = res as userData[];
    // })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public customSort = (event) => {
    console.log(event);
    // this.dataSource.sort = event.direction;
    this.dataSource.data.sort(
      (a, b) => {
          return event.direction === 'asc' ? a[event.active] - b[event.active] : (event.direction === 'desc' ? b[event.active] - a[event.active] : a[event.active] - b[event.active]);
      }
  );

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
 
  public redirectToDetails = (element: userData) => {
    
  }
 
  public redirectToUpdate = (element: userData) => {
    const id = element.Id;
    this.router.navigate(['edit', id], {relativeTo: this.route});
  }


  public addUser() {
    this.router.navigate(['create-user'], {relativeTo: this.route});
  }
 
  public redirectToDelete = (id: string) => {
    
  }
 
}
