import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, finalize, retry} from "rxjs/operators";
import {AuthModel} from "../../modules/auth/models/auth.model";
import {AuthService} from "../../modules/auth";
import {Customer} from "../Model/customer";

@Injectable({
  providedIn: 'root'
})

export class sbragreementService {

  //baseURL = '/oapf/api'
  //oapfURL = 'http://localhost:8765/oapf'
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  constructor(private http: HttpClient,private authService: AuthService) { }

  getSBR(data: any , id: any, methodType: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(methodType === 'id') {
      return this.http.get<any>('/oaadmin/api/v1/sbrs', {headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else {
      return this.http.get<any>('/oaadmin/api/v1/sbrs', {headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
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
    const id =  data.invoiceNumber;
    const dataPost = JSON.stringify(data);
    console.log(dataPost)
    if(mode === 'new') {
      return this.http.post<any>('/oaadmin/api/v1/sbrs', dataPost, {
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
      return this.http.put<any>('/oaadmin/api/v1/sbrs' , dataPost , {
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
      return this.http.put<any>('/oaadmin/api/v1/sbrs', dataPost , {
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
      return this.http.delete<any>('/oaadmin/api/v1/sbrs/'+ id  , {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else {
      return this.http.post<any>('/oaadmin/api/v1/sbrs/' , dataPost , {
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


  loadSBR(): Observable<Customer> {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get<any>('/oaadmin/api/v1/sbrs/master',{headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

}
