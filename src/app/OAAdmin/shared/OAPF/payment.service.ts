import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, finalize, retry} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {AuthModel} from "../../../modules/auth/models/auth.model";
import {AuthService} from "../../../modules/auth";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class paymentService {
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  //create method
  dataItem(data: any, mode: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    //'Access-Control-Allow-Origin': '*'
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'

    });
    const id = data.invoiceNumber;
    const dataPost = JSON.stringify(data);
    console.log(dataPost)
    if (mode === 'new') {
      return this.http.post<any>('/oapf/api/v1/payments', dataPost, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          console.log(err)
          this._errorMessage.next(err);
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if (mode === 'edit') {
      return this.http.put<any>('/oapf/api/v1/payments', dataPost, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.log(err)
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if (mode === 'auth') {
      return this.http.put<any>('/oapf/api/v1/invoices/payments', dataPost, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.log(err)
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if (mode === 'delete') {
      return this.http.delete<any>('/oapf/api/v1/payments/' + id, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else {
      return this.http.post<any>('/oapf/api/v1/payments/', dataPost, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.log(err)
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
  }

  getPayments(data: any , id: any, methodType: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(methodType === 'id') {
      return this.http.get<any>('/oapf/api/v1/payments', {headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('transactionStatus', 'PENDING');
      return this.http.get<any>('/oapf/api/v1/payments', {params: httpParams,headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
  }

}
