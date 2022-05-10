declare var require: any;
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator'

import { USERDATA } from '../../../_interface/user.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AccountService } from 'src/app/shared/services/account.service';
import { AbstractBaseClassComponent } from '../Abstract-base-class';

const mockData = require('../../../../assets/data/users.json');
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
    private cdr: ChangeDetectorRef,
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
    this.dataSource.data = mockData.users as USERDATA[];
    localStorage.setItem('users', JSON.stringify(mockData.users));
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

  public addUser(): void {
    this.router.navigate(['create-user'], { relativeTo: this.route });
  }

  public redirectToUpdate = (element: USERDATA) => {
    this.router.navigate(['edit', element.id], { relativeTo: this.route });
  }

  public deleteUser = (element: USERDATA) => {
    const foundIndex = this.accountService.userListSubject.value.findIndex(x => x.id === element.id);
    this.accountService.userListSubject.value.splice(foundIndex, 1);
    this.dataSource.data = this.accountService.userListSubject.value;
    this.refreshTable();
  }

  refreshTable() {
    this.accountService.userListSubject.next(this.dataSource.data);
    this.accountService.updateStorage(this.dataSource.data);
    this.cdr.detectChanges();
  }


}
