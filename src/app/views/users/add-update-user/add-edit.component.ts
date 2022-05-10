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
    userId: number;
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
        this.userId = this.route.snapshot?.params?.id;
        this.isAddMode = !this.userId;
        this.form = this.formBuilder.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            age: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            work: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            enable: ['', Validators.required],
        });

        if (!this.isAddMode) {
            const users = this.accountService.getusers;
            this.selectedUser = users.find(user => user.id === Number(this.userId));
            this.form.patchValue(this.selectedUser);
        }
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
        userDeatils.Id = this.selectedUser.id;
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
