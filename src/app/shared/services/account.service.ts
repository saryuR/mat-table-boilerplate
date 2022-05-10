import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { USERDATA } from '../../_interface/user.model';


@Injectable({ providedIn: 'root' })
export class AccountService {
    public userListSubject: BehaviorSubject<USERDATA[]>;

    constructor() {
        this.userListSubject = new BehaviorSubject<USERDATA[]>(JSON.parse(localStorage.getItem('users') || '[]'));
    }

    public update(id: number, params: USERDATA): Observable<any> {
        const foundIndex = this.userListSubject.value.findIndex(x => x.id === id);
        this.userListSubject.value[foundIndex] = params;
        this.updateStorage(this.userListSubject.value);
        return of(this.userListSubject.value);
    }

    public register(params: any): Observable<any> {
        this.userListSubject.value.push(params);
        this.updateStorage(this.userListSubject.value);
        return of(this.userListSubject.value);
    }

    public updateStorage(users: USERDATA[]): void {
        localStorage.setItem('users', JSON.stringify(users));
        this.userListSubject.next(users);
    }

    public get getusers(): USERDATA[] {
        return this.userListSubject.value;
    }

}
