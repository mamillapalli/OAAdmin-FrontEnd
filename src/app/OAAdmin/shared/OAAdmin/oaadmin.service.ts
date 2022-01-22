import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, finalize, retry} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {AuthModel} from "../../../modules/auth/models/auth.model";
import {AuthService} from "../../../modules/auth";
import {Customer} from "../../Model/customer";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class oaadminService {

  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  private authToken: AuthModel | any;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAccounts(data: any , id: any, methodType: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(methodType === 'filter') {
      const f = data.value.quantities

      let httpParams = new HttpParams();
      for(let i=0; i< f.length ;i++){
        httpParams = httpParams.append(f[i].qty, f[i].price);
      }
      console.log(httpParams)

      return this.http.get<any>('/oaadmin/api/v1/accounts',  { params:httpParams , headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else {
      return this.http.get<any>('/oaadmin/api/v1/accounts', {headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
  }

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

    const dataPost = JSON.stringify(data);
    console.log("Data Posting to Server")

    if(mode === 'new') {
      return this.http.post<any>('/oaadmin/api/v1/accounts', dataPost, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          console.log(err)
          this._errorMessage.next(err);
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if(mode === 'edit') {
      return this.http.put<any>('/oaadmin/api/v1/accounts' , dataPost , {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.log(err)
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if(mode === 'auth') {
      return this.http.put<any>('/oaadmin/api/v1/accounts/authorise', dataPost , {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.log(err)
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if(mode === 'delete') {
      return this.http.post <any>('oaadmin/api/v1/accounts/', dataPost ,{
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else {
      return this.http.post<any>('/oapf/api/v1/invoices/' , dataPost , {
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

}
