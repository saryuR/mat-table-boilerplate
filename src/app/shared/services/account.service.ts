import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { common, Prefix, userData } from '../../_interface/user.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AccountService {
    public userSubject: BehaviorSubject<userData>;
    public user: Observable<userData>;

    constructor(
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<userData>(JSON.parse(localStorage.getItem('user') || '{}'));
        this.user = this.userSubject.asObservable();
    }

    public login(username: string, password: string, grant_type: string): Observable<userData> {
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

    public getById(userid: string): Observable<userData> {
        return this.http.get<userData>(`${environment.urlAddress}/api/UserAccount/GetByUserId?userid=${userid}`);
    }

    public getData = (AccountId: number, pageNumber: number, pageSize: number) => {
        return this.http.get<userData[]>(`${environment.urlAddress}/api/UserAccount/GetAll?accountId=${AccountId}&sorted=true&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    public update(id: string, params: userData): Observable<any> {
        return this.http.put(`${environment.urlAddress}/api/UserAccount/Update`, params)
    }

    register(params: any): Observable<any> {
        return this.http.post(`${environment.urlAddress}/api/UserAccount/Create`, params)
    }

    sendInvitation(params: any): Observable<any> {
        return this.http.post(`${environment.urlAddress}/api/UserAccount/SendInvitation`, params);
    }

    public getUserPrefix(): Observable<Prefix[]> {
        return this.http.get<Prefix[]>(`${environment.urlAddress}/api/UserAccount/GetUserPrefix`);
    }

    public getLocalJobTitles(accountId: number): Observable<common[]> {
        return this.http.get<common[]>(`${environment.urlAddress}/api/LocalJobTitles?accountId=${accountId}&sorted=true`);
    }

    public getLocalDepartment(accountId: number): Observable<common[]> {
        return this.http.get<common[]>(`${environment.urlAddress}/api/LocalDepartment?accountId=${accountId}&sorted=false`);
    }

    public getReportsTo(accountId: number): Observable<common[]> {
        return this.http.get<common[]>(`${environment.urlAddress}/api/localJobTitles/reportsTo?accountId=${accountId}`);
    }

    public getRoles(userid: string, accountId: number): Observable<common[]> {
        return this.http.get<common[]>(`${environment.urlAddress}/api/Roles?userId=${userid}&accountId=${accountId}`);
    }

    public get userValue(): userData {
        return this.userSubject.value;
    }


}