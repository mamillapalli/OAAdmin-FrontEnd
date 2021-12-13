import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {ICreateAccount} from "../model/create-account.helper";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../modules/auth";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  // Base url


  constructor(private http: HttpClient,private authService: AuthService) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  // POST
  CreateCustomer(data: any): Observable<ICreateAccount> {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'GET');
    headers.append('Access-Control-Allow-Origin', '*');
    console.log('url is :'+API_USERS_URL);
    return this.http.post<ICreateAccount>(API_USERS_URL + '/customers/', JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  login(data: any): Observable<ICreateAccount> {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'GET');
    headers.append('Access-Control-Allow-Origin', '*');
    console.log('url is :'+API_USERS_URL);
    return this.http.post<ICreateAccount>(API_USERS_URL + '/authenticate/', JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  // GET
  GetCustomer(id: string | null): Observable<ICreateAccount> {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'GET');
    headers.append('Access-Control-Allow-Origin', '*');
    console.log('url is :'+API_USERS_URL);
    return this.http.get<ICreateAccount>(API_USERS_URL + '/api/v1/customers/' + id)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  // GET
  GetCustomers(): Observable<ICreateAccount> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<ICreateAccount>(API_USERS_URL + '/api/v1/customeradmins')
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  // PUT
  UpdateCustomer(id: string | null, data: any): Observable<ICreateAccount> {
    const auth = this.authService.getAuthFromLocalStorage();

    const httpOptions1 = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${auth?.jwt}`,
        'Content-Type': 'application/json'
      })
    };
    console.log('update customer post to server '+JSON.stringify(data));
    console.log('ID is  '+id);
    console.log('API_USERS_URL + \'/api/v1/customers/\' + id '+API_USERS_URL + '/api/v1/customers/' + id);
    return this.http.put<ICreateAccount>(API_USERS_URL + '/api/v1/customers/' + id, JSON.stringify(data),httpOptions1)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  // DELETE
  DeleteCustomer(id: string) {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'GET');
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.delete<ICreateAccount>(API_USERS_URL + '/api/v1/customers/' + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  // Error handling
  errorHandl(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
