import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {catchError, retry} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {Corporateadmin, inits} from "../../../Model/corporateadmin";
import {coporateadminreq} from "../../../Model/coporateadminreq";
import {Customer} from "../../../Model/customer";
import {Customerreq} from "../../../Model/customerreq";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-corporateadminmodal',
  templateUrl: './corporateadminmodal.component.html',
  styleUrls: ['./corporateadminmodal.component.scss']
})
export class CorporateadminmodalComponent implements OnInit {

  formsCount = 3;
  account$: BehaviorSubject<any> =
    new BehaviorSubject<Corporateadmin>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  errorMsg: string;
  private unsubscribe: Subscription[] = [];
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  coporateadminreq: coporateadminreq;
  Customerreq: Customerreq;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, public activeModal: NgbActiveModal, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<Corporateadmin>, isFormValid: boolean) => {
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
      this.coporateadminreq = new coporateadminreq();
      this.Customerreq = new Customerreq();

      if (!this.coporateadminreq.customers) {
        this.coporateadminreq.customers = [new Customerreq()];
      }

      this.coporateadminreq.userId = this.account$.value.userId
      this.coporateadminreq.firstName = this.account$.value.firstName
      this.coporateadminreq.lastName = this.account$.value.lastName
      this.coporateadminreq.effectiveDate = this.account$.value.effectiveDate
      this.coporateadminreq.status = this.account$.value.status
      this.coporateadminreq.emailAddress = this.account$.value.emailAddress
      this.coporateadminreq.roles = this.account$.value.roles

      this.Customerreq.customerId = this.account$.value.customers
      this.coporateadminreq.customers =  [this.Customerreq]


      console.log(this.coporateadminreq)
      const newreq = JSON.stringify(this.coporateadminreq)
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
    return this.http.post<any>(API_USERS_URL + '/api/v1/customeradmins/', data, {headers: httpHeaders})
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
    return this.http.put<any>(API_USERS_URL + '/api/v1/customeradmins/' + this.account$.value.userId, data, {headers: httpHeaders})
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
    return this.http.put<any>(API_USERS_URL + '/api/v1/customeradmins/authorise/' + this.account$.value.userId, {}, {headers: httpHeaders})
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
    return this.http.put<any>(API_USERS_URL + '/api/v1/customeradmins/delete' + this.account$.value.userId, {}, {headers: httpHeaders})
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
