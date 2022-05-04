import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from '../../../shared/services/account.service';
import { AlertService } from '../../../shared/services/alert.service';
import { roles } from 'src/app/_interface/user.model';
import { users  } from '../user-list/users';


@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    roleTypes: roles[];
    isAddMode: boolean;
    loading = false;
    submitted = false;
    user = users[0];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.getUserRoles();
        this.form = this.formBuilder.group({
            Prefix: ['', Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Email: ['', [Validators.required, Validators.email]],
            PhoneNumber: ['', Validators.required],
            Departments: ['', Validators.required],
            JobTitles: ['', Validators.required],
            ReportsTo: ['', Validators.required],
            Roles: ['', Validators.required],
        });

        if (!this.isAddMode) {
            this.form.patchValue(this.user);
            const userAccount = this.user.Accounts[0];
            // this.getNames(userAccount.Roles)
            this.f.Roles.setValue(userAccount.Roles);
            this.f.ReportsTo.setValue(this.getNames(userAccount.ReportsTo, 'Name'));
            this.f.JobTitles.setValue(this.getNames(userAccount.JobTitles, 'Name'));
            this.f.Departments.setValue(this.getNames(userAccount.Departments, 'Name'));
            this.f.Prefix.setValue(this.getNames(this.user.Prefix, 'Prefix'));


            // this.accountService.getById(this.id)
            //     .pipe(first())
            //     .subscribe(x => this.form.patchValue(x));
        }
    }

    getNames(data: any[], key: string): string {
       const keys = [];
        data.forEach(x => {
        keys.push(x[key]);
        });
        console.log(keys, keys.join(','))
        return keys.join(',');
    }

    getUserRoles() {
         this.roleTypes = [
            {
                Id: 1,
                Name: 'manager'
            },
            {
                Id: 2,
                Name: 'CA'
            }
        ]
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

    private createUser() {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
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