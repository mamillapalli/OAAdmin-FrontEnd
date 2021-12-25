import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, throwError} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {AuthService} from "../../modules/auth";
import {AuthModel} from "../../modules/auth/models/auth.model";


@Injectable({
  providedIn: 'root'
})

export class oapfcommonService {
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  responseType: any = 'text';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getMethod(type: any, param: any, statusType: any) {
    this._isLoading$.next(true);
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    let httpParams = new HttpParams();
    if(param != null) {
      const paramdata = param.split(',')
      for(let i=0 ; i < paramdata.length; i++) {
        httpParams = httpParams.append('transactionStatus', paramdata[i]);
      }
    }
    return this.http.get<any>('/oapf/api/v1/' + type, {params:httpParams , headers: httpHeaders}).pipe(
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
