import {Component, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../../modules/auth";
import Swal from "sweetalert2";
import {invoiceService} from "../../../../shared/OAPF/invoice.service";
import {Invoice, inits} from "../../../../Model/OAPF/Request/invoice";
import {cInvoice} from "../../../../Model/OAPF/CRequest/cinvoice";

@Component({
  selector: 'app-buyerapprovalinvoicesmodal',
  templateUrl: './buyerapprovalinvoicesmodal.component.html',
  styleUrls: ['./buyerapprovalinvoicesmodal.component.scss']
})
export class BuyerapprovalinvoicesmodalComponent implements OnInit {

  formsCount = 2;
  account$: BehaviorSubject<Invoice> =
    new BehaviorSubject<Invoice>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private unsubscribe: Subscription[] = [];
  cInvoice: cInvoice
  @Output() mode: any;
  @Output() formValue: any
  @Output() formElement: any
  fromParent: any;
  checkNextStage = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              public activeModal: NgbActiveModal,
              private authService: AuthService,
              public invoiceServices: invoiceService) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<Invoice>, isFormValid: boolean) => {
    this.formElement = this.account$;
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
    console.log('this is form next step elemet is ' + this.formElement)
    if (this.currentStep$.value === this.formsCount - 1) {



      // this.cInvoice.invoiceNumber = this.account$.value.invoiceNumber
      // this.cInvoice.sbrReferenceId = this.account$.value.sbrReferenceId
      // this.cInvoice.agreementId = this.account$.value.agreementId
      // this.cInvoice.anchorId = this.account$.value.anchorId
      // this.cInvoice.counterPartyId = this.account$.value.counterPartyId
      // this.cInvoice.documentType = this.account$.value.documentType
      // this.cInvoice.documentNumber = this.account$.value.documentNumber
      // this.cInvoice.currency = this.account$.value.currency
      // this.cInvoice.amount = this.account$.value.amount
      // this.cInvoice.date = formatDate(this.account$.value.date, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      // this.cInvoice.valueDate = formatDate(this.account$.value.valueDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      // this.cInvoice.dueDate = formatDate(this.account$.value.dueDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      // this.cInvoice.agreedPaymentDate = formatDate(this.account$.value.agreedPaymentDate, 'YYYY-MM-ddThh:mm:ss.s', 'en')
      // this.cInvoice.portOfLoading = this.account$.value.portOfLoading
      // this.cInvoice.portOfDischarge = this.account$.value.portOfDischarge
      // this.cInvoice.shipmentCorporation = this.account$.value.shipmentCorporation
      // this.cInvoice.realBeneficiary = this.account$.value.realBeneficiary
      // this.cInvoice.financingRate = this.account$.value.financingRate
      // this.cInvoice.financingInterestAmount = this.account$.value.financingInterestAmount
      // this.cInvoice.rebateAmount = this.account$.value.rebateAmount
      // this.cInvoice.netFinancingInterestAmount = this.account$.value.netFinancingInterestAmount
      // this.cInvoice.financeValueDate = this.account$.value.financeValueDate
      // this.cInvoice.financeDueDate = this.account$.value.financeDueDate
      // this.cInvoice.financeId = this.account$.value.financeId
      // this.cInvoice.financingAmount = this.account$.value.financingAmount
      // this.cInvoice.financingBalance = this.account$.value.financingBalance
      // this.cInvoice.paidBy = this.account$.value.paidBy
      // this.cInvoice.paymentDate = this.account$.value.paymentDate
      // this.cInvoice.paymentAmount = this.account$.value.paymentAmount
      // this.cInvoice.principalPaid = this.account$.value.principalPaid
      // this.cInvoice.interestPaid = this.account$.value.interestPaid
      //this.cInvoice.status = this.account$.value.status

      //const rmNewRequest = JSON.stringify(this.cInvoice)
      //this.cInvoice = this.account$.value;
      this.cInvoice = new cInvoice(this.account$.value);
      const rmNewRequest = this.cInvoice;
      console.log(rmNewRequest);
      if (this.mode === 'authBuyer') {
        this.checkNextStage = false;
        this.invoiceServices.dataItem(rmNewRequest, this.mode).subscribe(res => {
          if (res !== null && res !== '') {
            this.checkNextStage = true;
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
          if (res !== null && res !== '') {
            if (this.checkNextStage) {
              this.currentStep$.next(nextStep);
            }
          }
        }, (error: { message: any }) => {
          this.checkNextStage = false
          console.error('There was an error!', error);
          return;
        });
      } else if (this.mode === 'auth') {
        this.checkNextStage = false;
        this.invoiceServices.dataItem(rmNewRequest, this.mode).subscribe(res => {
          if (res !== null && res !== '') {
            this.checkNextStage = true;
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
          if (res !== null && res !== '') {
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
    }
    if (this.checkNextStage) {
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

}
