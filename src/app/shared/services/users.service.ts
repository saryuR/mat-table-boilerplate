import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { userData } from 'src/app/_interface/user.model';
 
@Injectable({
  providedIn: 'root'
})
export class UsersService {
 
  constructor(private http: HttpClient) { }
 
  public getData = (AccountId: string, pageNumber: number, pageSize: number) => {
    return this.http.get<userData[]>(`${environment.urlAddress}/api/UserAccount/GetAll?accountId=${AccountId}&sorted=true&pageNumber=${pageNumber}&pageSize=${pageSize}`);
   }
 
  public create = (route: string, body) => {
    return this.http.post(this.createCompleteRoute(route, environment.urlAddress), body, this.generateHeaders());
  }
 
  public update = (route: string, body) => {
    return this.http.put(this.createCompleteRoute(route, environment.urlAddress), body, this.generateHeaders());
  }
 
  public delete = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, environment.urlAddress));
  }
 
  private createCompleteRoute = (route: string, envAddress: string, params?: any) => {
    return `${envAddress}/${route}`;
  }
 
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
  }
}
