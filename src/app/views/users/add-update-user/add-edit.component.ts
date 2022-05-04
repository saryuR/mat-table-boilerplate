import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from '../../../shared/services/account.service';
import { AlertService } from '../../../shared/services/alert.service';
import { common, extras, Prefix, roles, userData } from 'src/app/_interface/user.model';
import { forkJoin } from 'rxjs';


@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    userId: string;
    roleTypes: roles[];
    isAddMode: boolean;
    loading = false;
    submitted = false;
    prefixs: Prefix[];
    localJobTitles: common[];
    localDepartment: common[];
    reportsTo: common[];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.initUserDetails();
        this.userId = this.route.snapshot.params['id'];
        this.isAddMode = !this.userId;
        this.form = this.formBuilder.group({
            Prefix: ['', Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Email: ['', [Validators.required, Validators.email]],
            PhoneNumber: ['', Validators.required],
            Departments: ['', Validators.required],
            JobTitleId: ['', Validators.required],
            ReportsTo: ['', Validators.required],
            Roles: ['', Validators.required],
            sendInvitation: [false]
        });

        if (!this.isAddMode) {

            this.accountService.getById(this.userId)
                .pipe(first())
                .subscribe((userDetails: userData) => {
                    this.setUserDetails(userDetails);
                });
        }
    }

    setUserDetails(userDetails: userData): void {
        this.form.patchValue(userDetails);
        const userAccount = userDetails.Accounts[0];
        this.f.Roles.setValue(userAccount.Roles);
        // this.f.ReportsTo.setValue(this.getNames(userAccount.ReportsTo, 'Name'));
        // this.f.JobTitles.setValue(this.getNames(userAccount.JobTitles, 'Name'));
        // this.f.Departments.setValue(this.getNames(userAccount.Departments, 'Name'));
        // this.f.Prefix.setValue(userDetails.UserPrefix);
    }

    getNames(data: any[], key: string): string {
        const keys = [];
        data.forEach(x => { keys.push(x[key]); });
        console.log(keys, keys.join(','))
        return keys.join(',');
    }

    getLoggedInUser() {
        return JSON.parse(localStorage.getItem('currentLoggedInUser'));
    }

    initUserDetails() {
        const loggedinUser = this.getLoggedInUser();
        const Prefix$ = this.accountService.getUserPrefix();
        const LocalJobTitles$ = this.accountService.getLocalJobTitles(loggedinUser.Accounts[0].AccountId);
        const LocalDepartment$ = this.accountService.getLocalDepartment(loggedinUser.Accounts[0].AccountId);
        const ReportsTo$ = this.accountService.getReportsTo(loggedinUser.Accounts[0].AccountId);
        const roles$ = this.accountService.getRoles(loggedinUser.UserId, loggedinUser.Accounts[0].AccountId)

        forkJoin({Prefix$, LocalJobTitles$, LocalDepartment$, ReportsTo$, roles$})
            .subscribe(res => {
                this.prefixs = res.Prefix$;
                this.localJobTitles = res.LocalJobTitles$;
                this.localDepartment = res.LocalDepartment$;
                this.reportsTo = res.ReportsTo$;
                this.roleTypes = res.roles$;
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser(): void {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: (res: any) => {
                    if (this.form.value.sendInvitation) {
                        const config = {
                            UserId: res.UserId,
                            Email: res.Email,
                            AccountId: res.AccountId
                        }
                        this.accountService.sendInvitation(config).subscribe(() => { });
                    }
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateUser(): void {
        this.accountService.update(this.userId, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}