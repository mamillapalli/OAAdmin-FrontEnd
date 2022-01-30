import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {formatDate} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import {Agreement, inits} from "../../../Model/agreement";
import {Agreementreq} from "../../../Model/agreementreq";
import {CopyAsModalComponent} from "../../../OAPF/common/copy-as-modal/copy-as-modal.component";
import {environment} from "../../../../../environments/environment";
import { AgreementMainComponent } from './agreement-main/agreement-main.component';
import { AgreementEndComponent } from './agreement-end/agreement-end.component';
import { CreditAdviseComponent } from 'src/app/OAAdmin/credit-advise/credit-advise.component';
import {oapfcommonService} from "../../../shared/oapfcommon.service";
import Swal from 'sweetalert2';
import { AgreementLimitComponent } from './agreement-limit/agreement-limit.component';

@Component({
  selector: 'app-agreementmodal',
  templateUrl: './agreementmodal.component.html',
  styleUrls: ['./agreementmodal.component.scss']
})
export class AgreementmodalComponent implements OnInit {
  modalOption: NgbModalOptions = {};
  @Output('displayedColumns') displayedColumns: any
  @Output('fDisplayedColumns') fDisplayedColumns: any;
  @ViewChild(AgreementMainComponent) AgreementMainComponent:AgreementMainComponent;
  @ViewChild(AgreementLimitComponent) AgreementLimitComponent:AgreementLimitComponent;
  formsCount = 3;
  closeResult: string;
  @Input() mode: any;
  @Input() modeCopy: any;
  @Output() formValue: any
  unsubscribe: Subscription[] = [];
  account$: BehaviorSubject<any> = new BehaviorSubject<Agreement>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errorMsg: string;
  fromParent: any;
  reqAgreementReq: Agreementreq;
  checkNextStage = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              public activeModal: NgbActiveModal,
              private authService: AuthService,
              public modalService: NgbModal,
              public oapfcommonService: oapfcommonService) {
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
     /* this.reqAgreementReq.contractReferenceNumber = this.account$.value.contractReferenceNumber
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
      this.reqAgreementReq.counterParties = this.account$.value.cntrPrtyList*/
      this.reqAgreementReq =  this.account$.value;

      //const agreementReq = JSON.stringify(this.reqAgreementReq)

      console.log('new is :'+this.reqAgreementReq)
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.oapfcommonService.dataItem(this.reqAgreementReq, '', this.mode, 'oaadmin/api/v1/agreements').subscribe(res => {
          if (res !== undefined) {
            this.checkNextStage = true;
            Swal.fire({
              title: 'Add Record Successfully',
              icon: 'success'
            }).then((result) => {
              console.log(result)
              if (result.value) {
                Swal.close();
                this.activeModal.close();
              }
            });
          } else {
            Swal.fire({
              title: 'Error is occurred.',
              icon: 'error'
            });
          }
          if (res !== undefined) {
            if (this.checkNextStage) {
              this.currentStep$.next(nextStep);
            }
          }
        }, (error: { message: any }) => {
          this.checkNextStage = false
          console.error('There was an error!', error);
          return;
        });
      }
      else if (this.mode === 'edit') {
        this.checkNextStage = false;
        this.oapfcommonService.dataItem(this.reqAgreementReq, '', this.mode, 'oaadmin/api/v1/agreements').subscribe(res => {
          console.log('Response is : ' + res)
          if (res !== undefined) {
            this.checkNextStage = true;
            Swal.fire({
              title: 'Edit Record Successfully',
              icon: 'success'
            }).then((result) => {
              console.log(result)
              if (result.value) {
                Swal.close();
                this.activeModal.close();
              }
            });
          } else {
            Swal.fire({
              title: 'Error is occurred.',
              icon: 'error'
            });
          }
          if (res !== undefined) {
            if (this.checkNextStage) {
              this.currentStep$.next(nextStep);
            }
          }
        }, (error: { message: any }) => {
          this.checkNextStage = false
          console.error('There was an error!', error);
          return;
        });
      }
      else if (this.mode === 'auth') {
        this.checkNextStage = false;
        this.oapfcommonService.dataItem(this.reqAgreementReq, '', this.mode, 'oaadmin/api/v1/agreements').subscribe(res => {
          if (res !== undefined) {
            this.checkNextStage = true;
            Swal.fire({
              title: 'Authorize Record Successfully',
              icon: 'success'
            }).then((result) => {
              console.log(result)
              if (result.value) {
                Swal.close();
                this.activeModal.close();
              }
            });
          } else {
            Swal.fire({
              title: 'Error is occurred.',
              icon: 'error'
            });
          }
          if (res !== undefined) {
            if (this.checkNextStage) {
              this.currentStep$.next(nextStep);
            }
          }
        }, (error: { message: any }) => {
          this.checkNextStage = false
          console.error('There was an error!', error);
          return;
        });
      }
      // if (this.mode === 'new') {
      //   this.CreateAgreement(agreementReq).subscribe(res => {
      //     if(res) {
      //       this.currentStep$.next(nextStep);
      //     }
      //   }, (error: { message: any }) => {
      //     console.error('There was an error!', error);
      //     return;
      //   });
      // }
      // else if (this.mode === 'edit') {
      //
      //   this.modifyAgreement(agreementReq).subscribe(res => {
      //     if(res) {
      //       this.currentStep$.next(nextStep);
      //     }
      //   }, (error: { message: any }) => {
      //     console.error('There was an error!', error);
      //     return;
      //   });
      // }
      // else if (this.mode === 'auth') {
      //   this.authAgreement().subscribe(res => {
      //     if(res) {
      //       this.currentStep$.next(nextStep);
      //     }
      //   }, (error: { message: any }) => {
      //     console.error('There was an error!', error);
      //     return;
      //   });
      // }
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
  // CreateAgreement(data: any): Observable<any> {
  //   const auth = this.authService.getAuthFromLocalStorage();
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${auth?.jwt}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.post<any>(API_USERS_URL + '/api/v1/agreements/', data, {headers: httpHeaders})
  //     .pipe(
  //       retry(1),
  //       catchError(this.errorHandle)
  //     );
  // }
  //
  // modifyAgreement(data: any): Observable<any> {
  //   const auth = this.authService.getAuthFromLocalStorage();
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${auth?.jwt}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.put<any>(API_USERS_URL + '/api/v1/agreements/', data, {headers: httpHeaders})
  //     .pipe(
  //       retry(1),
  //       catchError(this.errorHandle)
  //     );
  // }
  //
  // public authAgreement(): Observable<any> {
  //   const auth = this.authService.getAuthFromLocalStorage();
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${auth?.jwt}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.put<any>(API_USERS_URL + '/api/v1/agreements/authorise/' + this.account$.value.userId, {}, {headers: httpHeaders})
  //     .pipe(
  //       retry(1),
  //       catchError(this.errorHandle)
  //     );
  // }
  //
  // deleteAgreement(): Observable<any> {
  //   const auth = this.authService.getAuthFromLocalStorage();
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${auth?.jwt}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.put<any>(API_USERS_URL + '/api/v1/agreements/delete' + this.account$.value.userId, {}, {headers: httpHeaders})
  //     .pipe(
  //       retry(1),
  //       catchError(this.errorHandle)
  //     );
  // }
  //
  // deleteModal() {
  //   this.deleteAgreement().subscribe(res => {
  //     if(res){
  //       this.activeModal.dismiss();
  //     }
  //   }, (error: { message: any }) => {
  //     console.error('There was an error!', error);
  //     return;
  //   });
  // }

  copyAs() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(CopyAsModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'copy';
    modalRef.componentInstance.functionType = 'admin';
    modalRef.componentInstance.url = '/oaadmin/api/v1/agreements/';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      this.modeCopy = 'copy';
      this.formValue = result
      const refNo = this.AgreementMainComponent.form.value.contractReferenceNumber;
      console.log('Result is ' + result);
      console.log('refNo is ' + refNo);
      this.formValue = result
      this.formValue['contractReferenceNumber'] = refNo
      this.formValue['contractDocumentNumber'] = refNo
      this.AgreementMainComponent.formValue = result
      this.AgreementMainComponent.updateForm()
      this.AgreementMainComponent.form.value.contractReferenceNumber = refNo;
      // this.AgreementMainComponent.defaultValues = result

      // this.AgreementMainComponent.form.patchValue(this.formValue)
      // this.AgreementMainComponent.f.anchorCustomerId.setValue(this.formValue.anchorCustomer.customerId);
      // this.AgreementMainComponent.f.rmId.setValue(this.formValue.anchorCustomer.customerId);
      // this.AgreementMainComponent.form.value.contractReferenceNumber = refNo;
      // this.AgreementMainComponent.f.businessType.setValue(this.formValue.businessType);
      // if (this.formValue.counterParties.length > 0) {
      //   this.AgreementMainComponent.dataSource.data = this.formValue.counterParties;
      //   this.AgreementMainComponent.dataSource.sort = this.AgreementMainComponent.sort;
      //   this.AgreementMainComponent.dataSource.paginator = this.AgreementMainComponent.paginator;
      //   this.AgreementMainComponent.checkCustomerSelected = true;
      // }
      // this.AgreementLimitComponent.form.patchValue(this.formValue)
      // this.AgreementLimitComponent.defaultValues = result
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openAdvicePdf( mode: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //  this.modalOption.windowClass = 'my-class'
    this.modalOption.size='lg';
    const modalRef = this.modalService.open(CreditAdviseComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    //  modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
