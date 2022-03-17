import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../modules/auth";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, delay, finalize, retry } from "rxjs/operators";
import { AuthModel } from "../../modules/auth/models/auth.model";
import { environment } from "../../../environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "./notification.service";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class OODataServce {
  private authToken: AuthModel | undefined;
  private url: any;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  constructor(private http: HttpClient, private authService: AuthService,private spinner: NgxSpinnerService, public notifyService: NotificationService,) { }

  //create method
  OODataCall(data: any, mode: any, type: any): Observable<any> {
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    if (type == 'currency') {
      this.url = 'oadata/api/v1/currencies/';
    } else if (type == 'EXCH') {
      this.url = 'oadata/api/v1/exchangeRates/';
    }else if (type == 'INT') {
      this.url = 'oadata/api/v1/interestRates/';
    }else  if (type == 'HOLIDAY') {
      this.url = 'oadata/api/v1/holidays/';
    }
    if (mode === 'new') {
      return this.http.post<any>(this.url, data, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
                  this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([undefined]);
        }),
        finalize(() => this.spinner.hide())
      );
    } else if (mode === 'edit') {
      return this.http.put<any>(this.url, data, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
                  this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([undefined]);
        }),
        finalize(() => this.spinner.hide())
      );
    } else if (mode === 'auth') {
      return this.http.post<any>(this.url, data, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
                  this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([undefined]);
        }),
        finalize(() => this.spinner.hide())
      );
    } else if (mode === 'delete') {
      return this.http.post<any>(this.url + data.isoCode, data, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
                  this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([undefined]);
        }),
        finalize(() => this.spinner.hide())
      );
    } else {
      return this.http.post<any>(this.url + data.rmId, data, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
                  this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([undefined]);
        }),
        finalize(() => this.spinner.hide())
      );
    }
  }

  get isLoading$() {
    return this._isLoading$.asObservable();
  }

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


}
