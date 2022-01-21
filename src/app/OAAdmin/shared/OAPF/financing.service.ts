import {Injectable} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {catchError, finalize, retry} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {AuthModel} from "../../../modules/auth/models/auth.model";
import {AuthService} from "../../../modules/auth";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

export class financingService {
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
      return this.http.post<any>('/oapf/api/v1/finances', dataPost, {
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
      return this.http.put<any>('/oapf/api/v1/finances', dataPost, {
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
      return this.http.put<any>('/oapf/api/v1/invoices/finances', dataPost, {
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
      return this.http.delete<any>('/oapf/api/v1/finances/' + id, {
        headers: httpHeaders
      }).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          return of(null);
        }),
        finalize(() => this._isLoading$.next(false))
      );
    } else {
      return this.http.post<any>('/oapf/api/v1/finances/', dataPost, {
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



  getFinancing(data: any , id: any, methodType: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    if(methodType === 'id') {
      return this.http.get<any>('/oapf/api/v1/finances', {headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else if(methodType === 'financeModal') {
      let httpParams = new HttpParams();
      httpParams = httpParams.append('transactionStatus', 'MASTER');
      return this.http.get<any>('/oapf/api/v1/finances', {params: httpParams,headers: httpHeaders}).pipe(
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
      return this.http.get<any>('/oapf/api/v1/finances', {params: httpParams,headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error(err);
          return of({id: undefined});
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
  }

  getVoucherEntries(url:any,data: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    const removeEmptyOrNull = (obj: any) => {
      Object.keys(obj).forEach(k =>
        (obj[k] && typeof obj[k] === 'object') && removeEmptyOrNull(obj[k]) ||
        (!obj[k] && obj[k] !== undefined) && delete obj[k]
      );
      return obj;
    };
    const myObj2 = removeEmptyOrNull(data);
    const dataConvertPost = JSON.stringify(myObj2)
    return this.http.post<any>(url, dataConvertPost, {
      headers: httpHeaders
    }).pipe(
      catchError(this.handleError),
      finalize(() => this._isLoading$.next(false))
    );

  }

  CalculateFinanceDetails(data: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    const removeEmptyOrNull = (obj: any) => {
      Object.keys(obj).forEach(k =>
        (obj[k] && typeof obj[k] === 'object') && removeEmptyOrNull(obj[k]) ||
        (!obj[k] && obj[k] !== undefined) && delete obj[k]
      );
      return obj;
    };

    const myObj2 = removeEmptyOrNull(data);

    // console.log('myobject is '+myObj2);
    //
    // const dataPost = JSON.parse(JSON.stringify(data).replace(/:null/gi, ':'));
    // console.log('datapost is '+dataPost);

    console.log('remove null is '+this.removeNulls(data))

    const dataConvertPost = JSON.stringify(myObj2)

    console.log('data coverted is '+dataConvertPost)

    // const req = new HttpRequest('POST', '/oapf/api/v1/finances/calculateFinanceDetails', dataConvertPost, {
    //   headers: httpHeaders,
    // });

    // return this.http.request(req).pipe(
    //   catchError(this.handleError),
    //   finalize(() => this._isLoading$.next(false))
    // );

    return this.http.post<any>('/oapf/api/v1/finances/calculateFinanceDetails', dataConvertPost, {
      headers: httpHeaders
    }).pipe(
      catchError(this.handleError),
      finalize(() => this._isLoading$.next(false))
    );



    // let httpParams = new HttpParams();
    // httpParams = httpParams.append('data', dataPost);
    // return this.http.get<any>(`/oapf/api/v1/finances/calculateFinanceDetails`, { params: httpParams , headers: httpHeaders, } ).pipe(
    //   catchError(err => {
    //     this._errorMessage.next(err);
    //     console.error(err);
    //     return of({id: undefined});
    //   }),
    //   finalize(() => this._isLoading$.next(false))
    // );


  }

  removeNulls(obj: any){
    var isArray = obj instanceof Array;
    for (var k in obj){
      if (obj[k]===null) isArray ? obj.splice(k,1) : delete obj[k];
      else if (typeof obj[k]=="object") this.removeNulls(obj[k]);
    }
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / (event.total ?? 0));
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.log(error)
      console.error(
        `Backend returned code ${error.message}, body was: `, error.message);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;
  parseIsoDateStrToDate(key: any, value: string | number | Date){
    if (typeof value === "string" && this.isoDateFormat.test(value)){
      return new Date(value);
    }
    return value
  }
}
