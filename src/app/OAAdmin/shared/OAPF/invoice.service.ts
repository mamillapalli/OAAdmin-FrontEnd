import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, delay, finalize, retry} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {AuthModel} from "../../../modules/auth/models/auth.model";
import {AuthService} from "../../../modules/auth";
import {Customer} from "../../Model/customer";
import {NgxSpinnerService} from "ngx-spinner";
import {NotificationService} from "../notification.service";

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class invoiceService {

  //baseURL = '/oapf/api'
  //oapfURL = 'http://localhost:8765/oapf'
  private authToken: AuthModel | undefined;
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _errorMessage = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private authService: AuthService,private spinner: NgxSpinnerService, public notifyService: NotificationService) {
  }

  getInvoiceWithPagination(url:any , data: any, id: any, currentPage: any, pageSize: any, sortData:any, methodType:any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(methodType === 'pagination') {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      console.log(sortData)
      if (sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);
      //httpParams = httpParams.append('direction', sortData);
      return this.http.get<any>(url, {headers: httpHeaders, params: httpParams}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else if(methodType === 'loanDueDate') {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      console.log(sortData)
      if (sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);
      httpParams = httpParams.append('dueDate', data);
      return this.http.get<any>(url, {headers: httpHeaders, params: httpParams}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else if(methodType === 'copy') {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      console.log(sortData)
      if (sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);
      httpParams = httpParams.append('transactionStatus', 'MASTER');
      return this.http.get<any>(url, {headers: httpHeaders, params: httpParams}).pipe(
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
      httpParams = httpParams.append('page', currentPage);
      httpParams = httpParams.append('size', pageSize);
      console.log(sortData)
      if (sortData !== null && sortData !== undefined)
        httpParams = httpParams.append('sort', sortData);
      httpParams = httpParams.append('transactionStatus', 'MASTER');
      return this.http.get<any>(url, {headers: httpHeaders, params: httpParams}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
  }

  getInvoice(data: any, id: any, methodType: any): Observable<any> {
    this.spinner.show()
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if (methodType === 'id') {
      return this.http.get<any>('/oapf/api/v1/invoices', {headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
    }
    else if (methodType === 'filter') {
      let httpParams = new HttpParams();
      return this.http.get<any>('/oapf/api/v1/invoices', {headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
    }
    else if (methodType === 'loanDueDate') {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('dueDate', data);
      httpParams = httpParams.append('transactionStatus', 'MASTER');
      httpParams = httpParams.append('status', 'FINANCE_READY');
      return this.http.get<any>('/oapf/api/v1/invoices', {params: httpParams, headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
    }
      // else if(methodType === 'pagination') {
      //   let httpParams = new HttpParams();
      //   httpParams = httpParams.append('page', currentPage);
      //   httpParams = httpParams.append('size', pageSize);
      //   httpParams = httpParams.append('sort', 'invoiceNumber');
      //   return this.http.get<any>('/oapf/api/v1/invoices', {headers: httpHeaders}).pipe(
      //     catchError(err => {
      //       this._errorMessage.next(err);
      //       console.error(err);
      //       return of({id: undefined});
      //     }),
      //     finalize(() => this._isLoading$.next(false))
      //   );
    // }
    else if (methodType === 'viewHistory') {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('invoiceNumber', id);
      return this.http.get<any>('/oapf/api/v1/invoiceHistory', {params: httpParams, headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      );
    }
    else {
      return this.http.get<any>('/oapf/api/v1/invoices', {headers: httpHeaders}).pipe(
        delay(100),
        catchError((err) => {
          this.notifyService.showError(err.error.message, 'Error')
          this.spinner.hide()
          return of([]);
        }),
        finalize(() => this.spinner.hide())
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
    const id = data.invoiceNumber;
    const dataPost = JSON.stringify(data);
    console.log(dataPost)
    if (mode === 'new') {
      return this.http.post<any>('/oapf/api/v1/invoices', dataPost, {
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
      return this.http.put<any>('/oapf/api/v1/invoices', dataPost, {
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
      return this.http.put<any>('/oapf/api/v1/invoices/authorise', dataPost, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.log(err)
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else if (mode === 'authBuyer') {
      return this.http.put<any>('/oapf/api/v1/invoices/registerAnchorPartyApproval', dataPost, {
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
      return this.http.delete<any>('/oapf/api/v1/invoices/' + id, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else {
      return this.http.post<any>('/oapf/api/v1/invoices/', dataPost, {
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
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }


  loadSBR(): Observable<any> {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get<any>('/oaadmin/api/v1/sbrs/master', {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

  upload(file: File): Observable<HttpEvent<any>> {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('docType', 'Invoice');
    console.log(formData)
    return this.http.post<any>('/oapf/api/v1/invoices/uploadFile', formData, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

  uploadFileStatus(fileId: any): Observable<HttpEvent<any>> {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    let httpParams = new HttpParams();
    httpParams = httpParams.append('fileId', fileId);
    return this.http.get<any>('/oapf/api/v1/invoices/uploadFileStatus', {params: httpParams, headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

}
