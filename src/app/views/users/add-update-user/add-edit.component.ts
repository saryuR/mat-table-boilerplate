import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';

import { USERDATA } from '../../../_interface/user.model';
import { AccountService } from '../../../shared/services/account.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AbstractBaseClassComponent } from '../Abstract-base-class';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent extends AbstractBaseClassComponent implements OnInit {
    form: FormGroup;
    selectedUser: USERDATA;
    userId: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public accountService: AccountService,
        private alertService: AlertService
    ) {
        super();
    }

    ngOnInit(): void {
        this.initUserDetails();
        this.userId = this.route.snapshot?.params?.id;
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
                .pipe(takeUntil(this.destroyed$))
                .pipe(first())
                .subscribe((userDetails: USERDATA) => {
                    this.selectedUser = userDetails;
                    this.setUserDetails(userDetails);
                });
        }
    }

    setUserDetails(userDetails: USERDATA): void {
        this.form.patchValue(userDetails);
        const userAccount = userDetails.Accounts[0];
        this.f.Prefix.setValue(userDetails.Prefix[0].Prefix);
        this.f.ReportsTo.setValue(userAccount?.ReportsTo[0]?.Id);
        this.f.JobTitleId.setValue(userAccount?.JobTitles[0]?.Id);
        this.f.Departments.setValue(userAccount?.Departments[0]?.Id);
        const selectedRoles = [];
        userAccount.Roles.forEach(data => { selectedRoles.push(data.Id); });
        this.f.Roles.setValue(selectedRoles);
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
        const payload = this.preparePayload(false, this.form.value);
        this.accountService.register(payload)
            .pipe(first())
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => {
                    if (this.form.value.sendInvitation) {
                        const config = {
                            UserId: this.loggedinUser.UserId,
                            Email: this.form.value.Email,
                            AccountId: this.AccountId
                        };
                        this.accountService.sendInvitation(config).pipe(takeUntil(this.destroyed$)).subscribe(() => { });
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
        const userDeatils = this.form.value;
        userDeatils.Id = this.selectedUser.Id;
        userDeatils.UserId = this.selectedUser.UserId;
        const payload = this.preparePayload(true, userDeatils);
        this.accountService.update(this.userId, payload)
            .pipe(takeUntil(this.destroyed$))
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
