import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {formatDate} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import {Agreement, inits} from "../../../Model/agreement";
import {Agreementreq} from "../../../Model/agreementreq";
import {environment} from "../../../../../environments/environment";
import {ICreateAccount} from "../../../../modules/wizards/create-account.helper";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-agreementmodal',
  templateUrl: './agreementmodal.component.html',
  styleUrls: ['./agreementmodal.component.scss']
})
export class AgreementmodalComponent implements OnInit {

  formsCount = 3;
  @Input() mode: any;
  @Output() formValue: any
  unsubscribe: Subscription[] = [];
  account$: BehaviorSubject<any> = new BehaviorSubject<Agreement>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errorMsg: string;
  fromParent: any;
  reqAgreementReq: Agreementreq;

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

  updateAccount = (part: Partial<Agreement>, isFormValid: boolean) => {
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
      this.reqAgreementReq = new Agreementreq();
      this.reqAgreementReq.contractReferenceNumber = this.account$.value.contractReferenceNumber
      this.reqAgreementReq.contractDocumentNumber = this.account$.value.contractDocumentNumber
      this.reqAgreementReq.remarks = this.account$.value.remarks
      this.reqAgreementReq.transactionDate = formatDate(this.account$.value.transactionDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.reqAgreementReq.validDate = formatDate(this.account$.value.validDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.reqAgreementReq.expiryDate = formatDate(this.account$.value.expiryDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.reqAgreementReq.limitReference = this.account$.value.limitReference
      this.reqAgreementReq.limitExpiry = this.account$.value.limitExpiry
      this.reqAgreementReq.limitCurrency = this.account$.value.limitCurrency
      this.reqAgreementReq.cashMargin = this.account$.value.cashMargin
      this.reqAgreementReq.limitAmount = this.account$.value.limitAmount
      this.reqAgreementReq.businessType = this.account$.value.businessType
      this.reqAgreementReq.anchorCustomer = this.account$.value.anchorCustomer
      this.reqAgreementReq.rm = this.account$.value.rm
      this.reqAgreementReq.counterParties = this.account$.value.counterParties

      const agreementReq = JSON.stringify(this.reqAgreementReq)

      console.log('new is :'+agreementReq)
      if (this.mode === 'new') {
        this.CreateAgreement(agreementReq).subscribe(res => {
          if(res) {
            this.currentStep$.next(nextStep);
          }
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'edit') {

        this.modifyAgreement(agreementReq).subscribe(res => {
          if(res) {
            this.currentStep$.next(nextStep);
          }
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'auth') {
        this.authAgreement().subscribe(res => {
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
  CreateAgreement(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(API_USERS_URL + '/api/v1/agreements/', data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  modifyAgreement(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/agreements/' + this.account$.value.userId, data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  public authAgreement(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/agreements/authorise/' + this.account$.value.userId, {}, {headers: httpHeaders})
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
