import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {formatDate} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import {bankuser, inits} from "../../../Model/request/bankuser";
import {bankuserreq} from "../../../Model/response/bankuserreq";
import {environment} from "../../../../../environments/environment";
const API_USERS_URL = `${environment.apiUrl}`;
1
@Component({
  selector: 'app-bankusermodal',
  templateUrl: './bankusermodal.component.html',
  styleUrls: ['./bankusermodal.component.scss']
})
export class BankusermodalComponent implements OnInit {
  formsCount = 3;
  @Input() mode: any;
  @Output() formValue: any
  unsubscribe: Subscription[] = [];
  account$: BehaviorSubject<any> = new BehaviorSubject<bankuser>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errorMsg: string;
  fromParent: any;
  reqBankUserReq: bankuserreq;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              public activeModal: NgbActiveModal,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<bankuser>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };
  modal: any;

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.currentStep$.value === this.formsCount - 1) {
      this.reqBankUserReq = new bankuserreq();
      this.reqBankUserReq.userId = this.account$.value.userId
      this.reqBankUserReq.firstName = this.account$.value.firstName
      this.reqBankUserReq.lastName = this.account$.value.lastName
      this.reqBankUserReq.effectiveDate = formatDate(this.account$.value.effectiveDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.reqBankUserReq.expiryDate = formatDate(this.account$.value.expiryDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.reqBankUserReq.status = this.account$.value.status
      this.reqBankUserReq.emailAddress = this.account$.value.emailAddress
      this.reqBankUserReq.roles = this.account$.value.roles

      const bankRequest = JSON.stringify(this.reqBankUserReq)

      console.log('new is :'+bankRequest)
      if (this.mode === 'new') {
        this.CreateBankUser(bankRequest).subscribe(res => {
          if(res) {
            this.currentStep$.next(nextStep);
          }
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'edit') {

        this.modifyBankUser(bankRequest).subscribe(res => {
          if(res) {
            this.currentStep$.next(nextStep);
          }
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'auth') {
        this.authBankUser().subscribe(res => {
          if(res) {
            this.currentStep$.next(nextStep);
          }
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      }
    }
    this.currentStep$.next(nextStep);
  }



  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  errorHandle(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage;
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

  CreateBankUser(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(API_USERS_URL + '/api/v1/bankusers/', data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  modifyBankUser(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/bankusers/' + this.account$.value.userId, data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  public authBankUser(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/bankusers/authorise/' + this.account$.value.userId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  deleteBankAdmin(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/bankusers/delete' + this.account$.value.userId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  deleteModal() {
    this.deleteBankAdmin().subscribe(res => {
      if(res){
        this.activeModal.dismiss();
      }
    }, (error: { message: any }) => {
      console.error('There was an error!', error);
      return;
    });
  }

}
