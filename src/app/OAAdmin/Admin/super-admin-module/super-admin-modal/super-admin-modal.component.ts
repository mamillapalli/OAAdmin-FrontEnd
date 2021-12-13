import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {inits, superAdmin} from "../../../Model/super-admin";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, retry} from "rxjs/operators";
import {AuthService} from "../../../../modules/auth";
import {environment} from "../../../../../environments/environment";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-super-admin-modal',
  templateUrl: './super-admin-modal.component.html',
  styleUrls: ['./super-admin-modal.component.scss']
})
export class SuperAdminModalComponent implements OnInit {

  formsCount = 3;
  account$: BehaviorSubject<any> =
    new BehaviorSubject<superAdmin>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  errorMsg: string;
  private unsubscribe: Subscription[] = [];
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  deleteModalDp: any;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, public activeModal: NgbActiveModal, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<superAdmin>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  modal: any;

  nextStep() {
    let nextStepBoolean = true;
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
      const jsonValue = JSON.stringify(this.account$.value)
      if (this.mode === 'new') {
        nextStepBoolean = false;
        this.CreateSuperAdmin(jsonValue).subscribe(res => {
          if (res != null)
             this.currentStep$.next(nextStep);
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'edit') {
        nextStepBoolean = false;
        this.modifySuperAdmin(jsonValue).subscribe(res => {
          this.currentStep$.next(nextStep);
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'auth') {
        nextStepBoolean = false;
        this.authSuperAdmin().subscribe(res => {
          this.currentStep$.next(nextStep);
        }, (error: { message: any }) => {
          console.error('There was an error!', error);
          return;
        });
      }
    }
    if(nextStepBoolean)
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
  //     return this.http.post(API_USERS_URL + '/api/v1/superadmins/',
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
  //     return this.http.put(API_USERS_URL + '/api/v1/superadmins/' + this.account$.value.customerId,
  //       JSON.stringify(this.account$.value), {headers: httpHeaders})
  //       .subscribe(res => {
  //         console.log(res)
  //       }, (error: { message: any; }) => {
  //         console.error('There was an error!', error);
  //       });
  //   } else if (this.mode === 'auth') {
  //     return this.http.put(API_USERS_URL + '/api/v1/superadmins/authorise/' + this.account$.value.customerId, {}, {headers: httpHeaders})
  //       .subscribe(res => {
  //         console.log(res)
  //       }, (error: { message: any; }) => {
  //         console.error('There was an error!', error);
  //       });
  //   } else if (this.mode === 'delete') {
  //     return this.http.put(API_USERS_URL + '/api/v1/superadmins/delete/' + this.account$.value.customerId, {headers: httpHeaders}, {headers: httpHeaders})
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

  CreateSuperAdmin(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(API_USERS_URL + '/api/v1/superadmins/', data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  modifySuperAdmin(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/superadmins/' + this.account$.value.userId, data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  public authSuperAdmin(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/superadmins/authorise/' + this.account$.value.userId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  deleteSuperAdmin(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/superadmins/delete' + this.account$.value.userId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  deleteModal(post: any) {
    this.deleteSuperAdmin().subscribe(res => {
      this.activeModal.dismiss();
    }, (error: { message: any }) => {
      console.error('There was an error!', error);
      return;
    });
  }

}
