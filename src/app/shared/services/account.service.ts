import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMMON, PREFIX, USERDATA } from '../../_interface/user.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AccountService {
    public userSubject: BehaviorSubject<USERDATA>;
    public user: Observable<USERDATA>;

    constructor(
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<USERDATA>(JSON.parse(localStorage.getItem('user') || '{}'));
        this.user = this.userSubject.asObservable();
    }

    public login(username: string, password: string, grantType: string): Observable<USERDATA> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        };
        const body = `username=${username}&password=${password}&grant_type=${grantType}`;
        return this.http.post<USERDATA>(`${environment.urlAddress}/token`, body, httpOptions)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    public getById(userid: string): Observable<USERDATA> {
        return this.http.get<USERDATA>(`${environment.urlAddress}/api/UserAccount/GetByUserId?userid=${userid}`);
    }

    public getData = (AccountId: number, pageNumber: number, pageSize: number) => {
        return this.http.get<USERDATA[]>(`${environment.urlAddress}/api/UserAccount/GetAll?accountId=${AccountId}&sorted=true&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    public update(id: string, params: USERDATA): Observable<any> {
        return this.http.put(`${environment.urlAddress}/api/UserAccount/Update`, params);
    }

    register(params: any): Observable<any> {
        return this.http.post(`${environment.urlAddress}/api/UserAccount/Create`, params);
    }

    sendInvitation(params: any): Observable<any> {
        return this.http.post(`${environment.urlAddress}/api/UserAccount/SendInvitation`, params);
    }

    public getUserPrefix(): Observable<PREFIX[]> {
        return this.http.get<PREFIX[]>(`${environment.urlAddress}/api/UserAccount/GetUserPrefix`);
    }

    public getLocalJobTitles(accountId: number): Observable<COMMON[]> {
        return this.http.get<COMMON[]>(`${environment.urlAddress}/api/LocalJobTitles?accountId=${accountId}&sorted=true`);
    }

    public getLocalDepartment(accountId: number): Observable<COMMON[]> {
        return this.http.get<COMMON[]>(`${environment.urlAddress}/api/LocalDepartment?accountId=${accountId}&sorted=false`);
    }

    public getReportsTo(accountId: number): Observable<COMMON[]> {
        return this.http.get<COMMON[]>(`${environment.urlAddress}/api/localJobTitles/reportsTo?accountId=${accountId}`);
    }

    public getRoles(userid: string, accountId: number): Observable<COMMON[]> {
        return this.http.get<COMMON[]>(`${environment.urlAddress}/api/Roles?userId=${userid}&accountId=${accountId}`);
    }

    public get userValue(): USERDATA {
        return this.userSubject.value;
    }
}
