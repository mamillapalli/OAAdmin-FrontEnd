import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {inits, rm} from "../../../Model/request/rm";
import {rmreq} from "../../../Model/response/rmreq";
import {formatDate} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, retry} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import Swal from 'sweetalert2';
import {OOAdminService} from "../../../shared/oaadmin.service";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-relationshipmanagermodal',
  templateUrl: './relationshipmanagermodal.component.html',
  styleUrls: ['./relationshipmanagermodal.component.scss']
})
export class RelationshipmanagermodalComponent implements OnInit {

  formsCount = 4;
  account$: BehaviorSubject<rm> =
    new BehaviorSubject<rm>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private unsubscribe: Subscription[] = [];
  rmRequest: rmreq
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              public activeModal: NgbActiveModal,
              private authService: AuthService,
              public OOAdminService: OOAdminService) {}

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<rm>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  nextStep() {
    let checkNextStage = true;

    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.currentStep$.value === this.formsCount - 1) {
      this.rmRequest = new rmreq();
      this.rmRequest.rmId = this.account$.value.rmId
      this.rmRequest.firstName = this.account$.value.firstName
      this.rmRequest.lastName = this.account$.value.lastName
      this.rmRequest.emailAddress = this.account$.value.emailAddress
      this.rmRequest.joiningDate = formatDate(this.account$.value.joiningDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      //this.rmRequest.validDate = formatDate(this.account$.value.validDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.rmRequest.expiryDate = formatDate(this.account$.value.expiryDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      this.rmRequest.status = this.account$.value.status
      this.rmRequest.customers = this.account$.value.customers
      const rmNewRequest = JSON.stringify(this.rmRequest)

      if (this.mode === 'new') {
        checkNextStage = true;

        this.CreateRM(rmNewRequest).subscribe(res => {
          if(res) {
            if (res) {
              Swal.fire({
                title: 'Add Record Successfully',
                icon: 'success'
              });
            } else {
              Swal.fire({
                title: 'Error is occurred.',
                icon: 'error'
              });
            }
            if(checkNextStage) {
              this.currentStep$.next(nextStep);
            }
          }
        }, (error: { message: any }) => {
          checkNextStage = false
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'edit') {
        checkNextStage = true;
        this.modifyRM(rmNewRequest).subscribe(res => {
          if (res) {
            Swal.fire({
              title: 'Edit Record Successfully',
              icon: 'success'
            });
          } else {
            Swal.fire({
              title: 'Error is occurred.',
              icon: 'error'
            });
          }
          if(res) {
            if(checkNextStage) {
              this.currentStep$.next(nextStep);
            }
          }
        }, (error: { message: any }) => {
          checkNextStage = false
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'auth') {
        checkNextStage = true;
        this.authRM().subscribe(res => {
          if (res) {
            Swal.fire({
              title: 'Authorize Record Successfully',
              icon: 'success'
            });
          } else {
            Swal.fire({
              title: 'Error is occurred.',
              icon: 'error'
            });
          }
          if(res) {
            if(checkNextStage) {
              this.currentStep$.next(nextStep);
            }
          }
        }, (error: { message: any }) => {
          checkNextStage = false
          console.error('There was an error!', error);
          return;
        });
      }
    }
    if(checkNextStage) {
      this.currentStep$.next(nextStep);
    }
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

  CreateRM(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(API_USERS_URL + '/api/v1/rms/', data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  modifyRM(data: any): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/rms/' + this.account$.value.rmId, data, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  public authRM(): Observable<any> {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/rms/authorise/' + this.account$.value.rmId, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
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

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  rmTransaction(data: any , mode: any)
  {
    console.log(mode)
    console.log(data)
    if(mode === 'new') {
      const ooAdminCreate = this.OOAdminService.OOAdminRM(data, mode).subscribe((res) => {
        if (res) {
          Swal.fire({
            title: 'Created transaction successfully',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error is occured',
            icon: 'error'
          });
        }
      }, err => this.onError(err));
      this.unsubscribe.push(ooAdminCreate);
    } else if (mode === 'edit')
    {
      const ooAdminUpdate = this.OOAdminService.OOAdminRM(data, mode).subscribe((res) => {
        if (res) {
          Swal.fire({
            title: 'update transaction successfully',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error is occured',
            icon: 'error'
          });
        }
      }, err => this.onError(err));
      this.unsubscribe.push(ooAdminUpdate);
    } else if (mode === 'auth')
    {
      const ooAdminAuth = this.OOAdminService.OOAdminRM(data, mode).subscribe((res) => {
        if (res) {
          Swal.fire({
            title: 'Authorise transaction successfully',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error is occured',
            icon: 'error'
          });
        }
      }, err => this.onError(err));
      this.unsubscribe.push(ooAdminAuth);
    }
  }

  private onError(err: any) {
    console.log(err);
    Swal.fire({
      title: 'Error is occurred.',
      icon: 'error'
    });
  }

}
