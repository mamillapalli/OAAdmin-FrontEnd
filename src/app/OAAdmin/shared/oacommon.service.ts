import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, delay, finalize, retry} from "rxjs/operators";
import {AuthService} from "../../modules/auth";
import {AuthModel} from "../../modules/auth/models/auth.model";
import {NgxSpinnerService} from "ngx-spinner";
import Swal from "sweetalert2";
import {NotificationService} from "./notification.service";


@Injectable({
  providedIn: 'root'
})

export class oaCommonService {
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  responseType: any = 'text';

  constructor(private http: HttpClient,
              private authService: AuthService,
              private spinner: NgxSpinnerService, public notifyService: NotificationService,) {
  }

  getReferenceNumber(refType: any) {
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<any>('/oaadmin/api/v1/'+refType+'/getNewReference', {headers: httpHeaders , responseType:this.responseType}).pipe(
      catchError((err) => {
        this.notifyService.showError(err.message, 'Error')
        return of(undefined);
      }),
      finalize(() => this.spinner.hide())
    );
  }

  getMethod(url: any, statusType: any) {
    console.log('get method')
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(statusType === 'MASTER')
    {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('status' , true);
      return this.http.get<any>(url, {headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
    }
    return this.http.get<any>(url, {headers: httpHeaders}).pipe(
      delay(100),
      catchError((err) => {
        this.notifyService.showError(err.message, 'Error')
        this.spinner.hide()
        return of([]);
      }),
      finalize(() => this.spinner.hide())
    );
  }

  getMethodWithPagination(url: any, statusType: any,currentPage:any,pageSize:any,sortData:any) {
    console.log('get method')
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(statusType === 'MASTER')
    {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('transactionStatus', statusType);
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      if(sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);
      return this.http.get<any>(url, {headers: httpHeaders,params:httpParams}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
    } else {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      if(sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);
      return this.http.get<any>(url, {headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
    }
  }

  dataItem(data: any, id:any, mode: any, url: any): Observable<any> {
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    const dataPost = JSON.stringify(data);
    if (mode === 'new') {
      return this.http.post<any>(url, dataPost, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    } else if (mode === 'edit') {
      return this.http.put<any>(url+'/'+id, dataPost, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    } else if (mode === 'auth') {
      return this.http.put<any>(url+'/authorise/'+ id,'', {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    } else if (mode === 'delete') {
      return this.http.put<any>(url + id, '',{
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    } else {
      return this.http.post<any>(url, dataPost, {
        headers: httpHeaders
      }).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    }
  }

  getFilter(data: any, methodType: any, url: any): Observable<any> {
    this.spinner.show()
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(methodType === 'filter') {
      const f = data.value.filterOption

      let httpParams = new HttpParams();
      for(let i=0; i< f.length ;i++){
        httpParams = httpParams.append(f[i].filterId, f[i].filterValue);
      }
      return this.http.get<any>(url,  { params:httpParams , headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    }
    else {
      return this.http.get<any>(url, {headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    }
  }

  getFilterWithPagination(data: any, methodType: any, url: any, currentPage:any, pageSize:any , sortData:any): Observable<any> {
    this.spinner.show()
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(methodType === 'filter') {
      const f = data.value.filterOption

      let httpParams = new HttpParams();
      for(let i=0; i< f.length ;i++){
        httpParams = httpParams.append(f[i].filterId, f[i].filterValue);
      }
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      if(sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);

      return this.http.get<any>(url,  { params:httpParams , headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    }
    else {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      if(sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);
      return this.http.get<any>(url, {headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          return of(undefined);
        }),
        finalize(() => this.spinner.hide())
      );
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.log('error is '+error)
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.log(
        `Backend returned code ${error.status}, body was: `, error.message);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  taskManagerStatus(url:any) {
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<any>(url, {headers: httpHeaders , responseType:this.responseType}).pipe(
      catchError((err) => {
        this.notifyService.showError(err.message, 'Error')
        return of(undefined);
      }),
      finalize(() => this.spinner.hide())
    );
  }

  getDataWithPagination(url:any ,currentPage: any, pageSize: any, sortData:any): Observable<any> {
    this.spinner.show();
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', currentPage);
    httpParams = httpParams.append('size', pageSize);
    console.log(sortData)
    if(sortData !== null && sortData !== undefined)
      httpParams = httpParams.append('sort', sortData);
    //httpParams = httpParams.append('direction', sortData);
    return this.http.get<any>(url, {headers: httpHeaders, params:httpParams}).pipe(
      delay(100),
      catchError((err) => {
        this.notifyService.showError(err.message, 'Error')
        this.spinner.hide()
        return of([]);
      }),
      finalize(() => this.spinner.hide())
    );
  }

  upload(url: any, file: File): Observable<HttpEvent<any>> {
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    const formData: FormData = new FormData();
    formData.append('file', file);
    console.log(formData)
    return this.http.post<any>(url, formData, {headers: httpHeaders})
      .pipe(
        delay(1000*10),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
  }

  uploadFileStatus(url:any , fileId: any): Observable<HttpEvent<any>> {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    let httpParams = new HttpParams();
    httpParams = httpParams.append('fileId', fileId);
    return this.http.get<any>(url, {params: httpParams, headers: httpHeaders})
      .pipe(
        delay(1000),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
  }

  errorHandle(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
