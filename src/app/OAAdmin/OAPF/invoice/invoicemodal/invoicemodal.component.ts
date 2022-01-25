import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {formatDate} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import Swal from "sweetalert2";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {Invoice, inits} from "../../../Model/OAPF/Request/invoice";
import {cInvoice} from "../../../Model/OAPF/CRequest/cinvoice";
import {oapfcommonService} from "../../../shared/oapfcommon.service";
import {InvoiceDOComponent} from "../../common/invoice-do/invoice-do.component";
import {Invoicestep1Component} from "./steps/invoicestep1/invoicestep1.component";
import {Invoicestep2Component} from "./steps/invoicestep2/invoicestep2.component";
import {ObjectMapper} from "json-object-mapper";
import {JsonConvert} from "json2typescript";

@Component({
  selector: 'app-invoicemodal',
  templateUrl: './invoicemodal.component.html',
  styleUrls: ['./invoicemodal.component.scss']
})
export class InvoicemodalComponent implements OnInit {

  formsCount = 1;
  account$: BehaviorSubject<Invoice> =
    new BehaviorSubject<Invoice>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private unsubscribe: Subscription[] = [];
  cInvoice: any
  @Input() mode: any;
  @Output() formValue: any
  @Output() formElement: any
  fromParent: any;
  checkNextStage = true;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  @ViewChild(Invoicestep1Component) Invoicestep1Component: Invoicestep1Component;
  @ViewChild(Invoicestep2Component) Invoicestep2Component: Invoicestep2Component;

  constructor(public activeModal: NgbActiveModal,
              public invoiceServices: invoiceService,
              public oapfcommonService: oapfcommonService,
              public modalService: NgbModal) {
  }

  ngOnInit(): void {
    console.log(this.mode)
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

    const nextStep = this.currentStep$.value ;
    if (nextStep > this.formsCount) {
      return;
    }
    console.log('this is form next step element is ' + this.formElement)
    if (this.currentStep$.value === this.formsCount) {


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
      //this.cInvoice = ObjectMapper.deserialize(cInvoice,this.account$.value);
      //this.cInvoice = this.account$.value;
      this.cInvoice = new cInvoice(this.account$.value);
      const rmNewRequest = this.cInvoice;
      console.log(rmNewRequest);
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.oapfcommonService.dataItem(rmNewRequest, '', this.mode, '/oapf/api/v1/invoices').subscribe(res => {
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
        this.oapfcommonService.dataItem(rmNewRequest, '', this.mode, '/oapf/api/v1/invoices').subscribe(res => {
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
        this.oapfcommonService.dataItem(rmNewRequest, '', this.mode, '/oapf/api/v1/invoices').subscribe(res => {
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

  copyAs() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(InvoiceDOComponent, this.modalOption);
    modalRef.componentInstance.mode = 'copy';
    modalRef.result.then((result) => {
      const refNo = this.Invoicestep1Component.invoiceForm.value.invoiceNumber;
      console.log('Result is ' + result);
      //this.updateAccount(result, true)
      this.formValue = result
      console.log(this.formValue)
      //this.Invoicestep1Component.updateForm()
      this.formValue.invoiceNumber = refNo
      this.Invoicestep1Component.invoiceForm.patchValue(this.formValue)
      this.Invoicestep1Component.invoiceForm.value.invoiceNumber = refNo;
      //this.Invoicestep1Component.updateReferenceNumber();
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
}
