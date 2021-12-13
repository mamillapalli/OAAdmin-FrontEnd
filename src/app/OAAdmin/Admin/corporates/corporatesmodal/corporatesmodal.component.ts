import {Component, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {BehaviorSubject, Subscription, throwError} from "rxjs";
import {Corporates, inits} from "../../../Model/corporates";
import {catchError, retry} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {CorporatesReq} from "../../../Model/corporatereq";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-corporatesmodal',
  templateUrl: './corporatesmodal.component.html',
  styleUrls: ['./corporatesmodal.component.scss']
})
export class CorporatesmodalComponent implements OnInit {
  @Input() mode: any;
  formsCount = 3;
  account$: BehaviorSubject<any> = new BehaviorSubject<Corporates>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output() formValue: any
  fromParent: any;
  private unsubscribe: Subscription[] = [];
  // corporatesReq: CorporatesReq;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, public activeModal: NgbActiveModal, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<Corporates>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

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
      // this.corporatesReq = new CorporateReq();
      //
      // this.corporatesReq.customerId = this.account$.value.userId
      // this.corporatesReq.name = this.account$.value.firstName
      // this.corporatesReq.addressLine1 = this.account$.value.lastName
      // this.corporatesReq.addressLine2 = this.account$.value.effectiveDate
      // this.corporatesReq.addressLine3 = this.account$.value.status
      // this.corporatesReq.poBox = this.account$.value.emailAddress
      // this.corporatesReq.country = this.account$.value.roles
      // this.corporatesReq.emailAddress = this.account$.value.roles
      // this.corporatesReq.vatRegistrationNumber = this.account$.value.roles
      // this.corporatesReq.taxRegistrationNumber = this.account$.value.roles
      // this.corporatesReq.directorName = this.account$.value.roles
      // this.corporatesReq.directorDetails = this.account$.value.roles
      // this.corporatesReq.sponsorName = this.account$.value.roles
      // this.corporatesReq.sponsorDetails = this.account$.value.roles
      // this.corporatesReq.status = this.account$.value.roles

      console.log(this.account$.value)
      const jsonValue = JSON.stringify(this.account$.value)
      if (this.mode === 'new') {
        this.CreateCorporates(jsonValue).subscribe(res => {
          this.currentStep$.next(nextStep);
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'edit') {

        this.modifyCorporates(jsonValue).subscribe(res => {
          this.currentStep$.next(nextStep);
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'auth') {
        this.authCorporates().subscribe(res => {
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

  private CreateCorporates(data: any) {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(API_USERS_URL + '/api/v1/customers/', data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  private modifyCorporates(data: any) {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/customers/' + this.account$.value.customerId, data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  private authCorporates() {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/customers/authorise/' + this.account$.value.customerId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

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
}
