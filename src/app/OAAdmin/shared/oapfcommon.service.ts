import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, delay, finalize} from "rxjs/operators";
import {AuthService} from "../../modules/auth";
import {AuthModel} from "../../modules/auth/models/auth.model";
import {NgxSpinnerService} from "ngx-spinner";
import {NotificationService} from "./notification.service";


@Injectable({
  providedIn: 'root'
})

export class oapfcommonService {
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');
  responseType: any = 'text';

  constructor(private http: HttpClient, private authService: AuthService,private spinner: NgxSpinnerService, public notifyService: NotificationService) {
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

    getAdminReferenceNumber(refType: any) {
    this._isLoading$.next(true);
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<any>('/oaadmin/api/v1/'+refType+'/getNewReference', {headers: httpHeaders , responseType:this.responseType}).pipe(
      catchError(this.handleError),
      finalize(() => this._isLoading$.next(false))
    );
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

  getMethodByValue(url: any, param: any, value: any) {
    this._isLoading$.next(true);
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    let httpParams = new HttpParams();
    if(param != null) {
      const paramData = param.split(',')
      const  valueData= value.split(',')
      for(let i=0,j=0 ; i < paramData.length,j<valueData.length; i++,j++) {
        httpParams = httpParams.append(paramData[i][j], valueData[i][j]);
      }
      httpParams = httpParams.append('transactionStatus', 'MASTER');
    }
    return this.http.get<any>(url, {params:httpParams , headers: httpHeaders}).pipe(
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

  //Filter
  getFilter(data: any, methodType: any, url: any): Observable<any> {
    this._isLoading$.next(true);
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
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else {
      return this.http.get<any>(url, {headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
  }

  getFilterWithPagination(data: any, methodType: any, url: any, currentPage:any, pageSize:any , sortData:any): Observable<any> {
    this.spinner.show()
    console.log(data)
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
    if(methodType === 'filterByData') {
      let httpParams = new HttpParams();
      httpParams = httpParams.append(data.filterId, data.filterValue);
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
      return this.http.put<any>(url, dataPost, {
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
      return this.http.put<any>(url+'/authorise/',dataPost, {
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
      return this.http.delete<any>(url +'/'+ id,{
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


  //sorting
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

  getDataWithPaginationMaster(url:any ,currentPage: any, pageSize: any, sortData:any): Observable<any> {
    this.spinner.show();
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    let httpParams = new HttpParams();
    httpParams = httpParams.append('transactionStatus', 'MASTER');
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

  getDataWithPaginationLoan(url:any ,currentPage: any, pageSize: any, sortData:any,loanDueDate: any): Observable<any> {
    this.spinner.show();
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    let httpParams = new HttpParams();
    httpParams = httpParams.append('dueDate', loanDueDate);
    httpParams = httpParams.append('page', currentPage);
    httpParams = httpParams.append('size', pageSize);
    httpParams = httpParams.append('transactionStatus', 'MASTER');
    httpParams = httpParams.append('status', 'FINANCE_READY');
    if(sortData !== null && sortData !== undefined)
      httpParams = httpParams.append('sort', sortData);
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
}
