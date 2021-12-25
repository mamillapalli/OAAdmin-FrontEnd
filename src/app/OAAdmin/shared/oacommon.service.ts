import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, finalize, retry} from "rxjs/operators";
import {AuthService} from "../../modules/auth";
import {AuthModel} from "../../modules/auth/models/auth.model";


@Injectable({
  providedIn: 'root'
})

export class oaCommonService {
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  responseType: any = 'text';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getReferenceNumber(refType: any) {
    this._isLoading$.next(true);
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<any>('/oapf/api/v1/'+refType+'/getNewReference', {headers: httpHeaders , responseType:this.responseType}).pipe(
      catchError(this.handleError),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getMethod(type: any, statusType: any) {
    this._isLoading$.next(true);
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    let httpParams = new HttpParams();
    //httpParams = httpParams.append('transactionStatus', statusType);

    return this.http.get<any>('/oaadmin/api/v1/' + type, {headers: httpHeaders}).pipe(
      catchError(this.handleError),
      finalize(() => this._isLoading$.next(false))
    );

  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
