import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { common, Prefix, userData } from 'src/app/_interface/user.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AccountService {
    public userSubject: BehaviorSubject<userData>;
    public user: Observable<userData>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<userData>(JSON.parse(localStorage.getItem('user') || '{}'));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): userData {
        return this.userSubject.value;
    }
    
    login(username: string, password: string, grant_type: string) {
        let httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        };
        let body = `username=${username}&password=${password}&grant_type=${grant_type}`;
        return this.http.post<userData>(`${environment.urlAddress}/token`, body, httpOptions)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    getById(userid: string) {
        return this.http.get<userData>(`${environment.urlAddress}/api/UserAccount/GetByUserId?userid=${userid}`);
    }

    update(id: string, params: userData) {
        
        return this.http.put(`${environment.urlAddress}/api/UserAccount/Update`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id === (this.userValue.Id).toString()) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    register(params: any) {
        return this.http.post(`${environment.urlAddress}/api/UserAccount/Create`, params)
            .pipe(map(x => {
                return x;
            }));
    }

    sendInvitation(params: any) {
        return this.http.post(`${environment.urlAddress}/api/UserAccount/SendInvitation`, params)
            .pipe(map(x => {
                return x;
            }));
        
    }

    delete(id: string) {
        // return this.http.delete(`${environment.urlAddress}/users/${id}`)
        //     .pipe(map(x => {
        //         // auto logout if the logged in user deleted their own record
        //         if (id == this.userValue.id) {
        //             // this.logout();
        //         }
        //         return x;
        //     }));
    }


    
    getUserPrefix() {
        return this.http.get<Prefix[]>(`${environment.urlAddress}/api/UserAccount/GetUserPrefix`);
    }

    getLocalJobTitles(accountId: number) {
        return this.http.get<common[]>(`${environment.urlAddress}/api/LocalJobTitles?accountId=${accountId}&sorted=true`);
    }

    getLocalDepartment(accountId: number) {
        return this.http.get<common[]>(`${environment.urlAddress}/api/LocalDepartment?accountId=${accountId}&sorted=false`);
    }

    getReportsTo(accountId: number) {
        return this.http.get<common[]>(`${environment.urlAddress}/api/localJobTitles/reportsTo?accountId=${accountId}`);
    }
}