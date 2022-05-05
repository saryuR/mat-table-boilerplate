import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
    this.getAllUsers();
  }

  public getAllUsers = () => {
    this.loading = true;
    this.dataSource.data = [];
    this.accountService.getData(this.AccountId, this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        this.dataSource.data = res as USERDATA[];
        this.loading = false;
      });
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
    this.router.navigate(['edit', element.UserId], { relativeTo: this.route });
  }

  public addUser() {
    this.router.navigate(['create-user'], { relativeTo: this.route });
  }

  public markUserAsInActive = (element: any) => {
    element.Departments = element.Accounts[0].Departments[0].Id;
    element.JobTitleId = element.Accounts[0].JobTitles[0].Id;
    element.ReportsTo = element.Accounts[0].ReportsTo[0].Id;
    element.Roles = [element.Accounts[0].Roles[0].Id];
    element.Prefix = element.Prefix.length > 0 ? element.Prefix[0]?.Prefix : 'Mrs.';
    const payload = this.preparePayload(true, element, true);
    this.accountService.update(element.UserId, payload).subscribe(() => {
      this.alertService.success('Update successful', { keepAfterRouteChange: true });
      this.getAllUsers();
    });
  }

}
