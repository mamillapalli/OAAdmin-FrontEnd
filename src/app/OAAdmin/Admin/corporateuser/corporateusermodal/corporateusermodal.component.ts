import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {catchError, retry} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {Corporateuser, inits} from "../../../Model/corporateuser";
import {Customerreq} from "../../../Model/customerreq";
import {corporateuserreq} from "../../../Model/corporateuserreq";
import {formatDate} from "@angular/common";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-corporateusermodal',
  templateUrl: './corporateusermodal.component.html',
  styleUrls: ['./corporateusermodal.component.scss']
})
export class CorporateusermodalComponent implements OnInit {

  formsCount = 3;
  account$: BehaviorSubject<any> =
    new BehaviorSubject<Corporateuser>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  errorMsg: string;
  private unsubscribe: Subscription[] = [];
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  corporateuserreq: corporateuserreq;
  Customerreq: Customerreq;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, public activeModal: NgbActiveModal, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<Corporateuser>, isFormValid: boolean) => {
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
      const auth = this.authService.getAuthFromLocalStorage();
      const httpHeaders = new HttpHeaders({
        Authorization: `Bearer ${auth?.jwt}`,
        'Content-Type': 'application/json'
      });
      console.log('auth jwt token is ' + auth?.jwt)
      this.corporateuserreq = new corporateuserreq();
      this.Customerreq = new Customerreq();

      if (!this.corporateuserreq.customers) {
        this.corporateuserreq.customers = [new Customerreq()];
      }

      this.corporateuserreq.userId = this.account$.value.userId
      this.corporateuserreq.firstName = this.account$.value.firstName
      this.corporateuserreq.lastName = this.account$.value.lastName
      this.corporateuserreq.effectiveDate = formatDate(this.account$.value.effectiveDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.corporateuserreq.expiryDate = formatDate(this.account$.value.expiryDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      console.log('expiryDate is '+this.corporateuserreq.expiryDate)
      console.log('effectiveDate is '+this.corporateuserreq.effectiveDate)
      this.corporateuserreq.status = this.account$.value.status
      this.corporateuserreq.emailAddress = this.account$.value.emailAddress
      this.corporateuserreq.roles = this.account$.value.roles

      this.Customerreq.customerId = this.account$.value.customers
      this.corporateuserreq.customers =  [this.Customerreq]


      console.log(this.corporateuserreq)
      const newreq = JSON.stringify(this.corporateuserreq)
      console.log('new is :'+newreq)
      if (this.mode === 'new') {
        this.CreateCorporateAdmin(newreq).subscribe(res => {
          this.currentStep$.next(nextStep);
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'edit') {

        this.modifyCorporateAdmin(newreq).subscribe(res => {
          this.currentStep$.next(nextStep);
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'auth') {
        this.authBankAdmin().subscribe(res => {
          this.currentStep$.next(nextStep);
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

  // submit() {
  //   console.log('submit')
  //
  //   console.log('mode of transaction is ' + jsonval);
  //
  //
  //   if (this.mode === 'new') {
  //     console.log(this.account$.value)
  //     console.log(this.cancelButton)
  //     return this.http.post(API_USERS_URL + '/api/v1/BankAdmins/',
  //       jsonval, {headers: httpHeaders})
  //       .pipe(
  //         catchError(error => {
  //           this.cancelButton = true;
  //           if (error.error instanceof ErrorEvent) {
  //             this.errorMsg = `Error: ${error.error.message}`;
  //           } else {
  //             this.errorMsg = `Error: ${error.message}`;
  //           }
  //           return [];
  //         })
  //       ).subscribe(res => {
  //         console.log(this.cancelButton)
  //         this.cancelButton = true;
  //         console.log(this.cancelButton)
  //         console.log(res);
  //       });
  //
  //
  //   } else if (this.mode === 'edit') {
  //     return this.http.put(API_USERS_URL + '/api/v1/BankAdmins/' + this.account$.value.customerId,
  //       JSON.stringify(this.account$.value), {headers: httpHeaders})
  //       .subscribe(res => {
  //         console.log(res)
  //       }, (error: { message: any; }) => {
  //         console.error('There was an error!', error);
  //       });
  //   } else if (this.mode === 'auth') {
  //     return this.http.put(API_USERS_URL + '/api/v1/BankAdmins/authorise/' + this.account$.value.customerId, {}, {headers: httpHeaders})
  //       .subscribe(res => {
  //         console.log(res)
  //       }, (error: { message: any; }) => {
  //         console.error('There was an error!', error);
  //       });
  //   } else if (this.mode === 'delete') {
  //     return this.http.put(API_USERS_URL + '/api/v1/BankAdmins/delete/' + this.account$.value.customerId, {headers: httpHeaders}, {headers: httpHeaders})
  //       .subscribe(res => {
  //         console.log(res)
  //       }, (error: { message: any; }) => {
  //         console.error('There was an error!', error);
  //       });
  //   }
  // }

  errorHandl(error: { error: { message: string; }; status: any; message: any; }) {
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

  CreateCorporateAdmin(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(API_USERS_URL + '/api/v1/customerusers/', data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  modifyCorporateAdmin(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/customerusers/' + this.account$.value.userId, data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  public authBankAdmin(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/customerusers/authorise/' + this.account$.value.userId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  deleteBankAdmin(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/customerusers/delete' + this.account$.value.userId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  deleteModal(post: any) {
    this.deleteBankAdmin().subscribe(res => {
      this.activeModal.dismiss();
    }, (error: { message: any }) => {
      console.error('There was an error!', error);
      return;
    });
  }

}
