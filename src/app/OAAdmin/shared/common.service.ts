import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {AuthService} from "../../modules/auth";
const API_USERS_URL = `${environment.apiUrl}`;
import { AuthModel } from 'src/app/modules/auth/models/auth.model';
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, finalize, retry,map} from "rxjs/operators";
import { Currency } from 'src/app/ReqModal/currency';
import { Agreement } from '../Model/agreement';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private extractData:any;
  protected _errorMessage = new BehaviorSubject<string>('');
  constructor(private http: HttpClient,private authService: AuthService) { }
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

    // Error handling
    errorHandle(error: { error: { message: string; }; status: any; message: any; }) {
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

    
  getAgreements(): Observable<Agreement> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<Agreement>('/oaadmin/api/v1/agreements',{headers: httpHeaders})
      .pipe(
        retry(1), 
        catchError(this.errorHandle)
      );
  }

  public getCurrencyList(): Observable<Currency> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<Currency>('/oadata/api/v1/currencies',{headers: httpHeaders});
  }


} 
  