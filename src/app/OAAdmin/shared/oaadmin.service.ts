import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../modules/auth";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, finalize, retry} from "rxjs/operators";
import {AuthModel} from "../../modules/auth/models/auth.model";
import {environment} from "../../../environments/environment";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class OOAdminService {
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  constructor(private http: HttpClient,private authService: AuthService) { }

  //create method
  OOAdminRM(data: any, mode: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    if(mode === 'new') {
      return this.http.post<any>(API_USERS_URL + '/rms/', data, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of([]);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if(mode === 'edit') {
      return this.http.post<any>(API_USERS_URL + '/rms/' + data.rmId , data , {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of([]);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if(mode === 'auth') {
      return this.http.post<any>(API_USERS_URL + '/rms/authorise/' + data.rmId , data , {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of([]);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if(mode === 'delete') {
      return this.http.post<any>(API_USERS_URL + '/rms/delete/' + data.rmId , data , {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of([]);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else {
      return this.http.post<any>(API_USERS_URL + '/rms/' + data.rmId , data , {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of([]);
        }),
        finalize(() => this._isLoading$.next(false))
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
