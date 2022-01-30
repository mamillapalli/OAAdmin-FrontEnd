import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {environment} from "../../../../../environments/environment";
import Swal from "sweetalert2";
import {sbragreementService} from "../../../shared/sbragreement.service";
import {Sbr, inits} from "../../../Model/sbr";
import {Sbrreq} from "../../../Model/sbrreq"
import {SbrMainComponent} from './sbr-main/sbr-main.component';
import {SbrAmtInfoComponent} from './sbr-amt-info/sbr-amt-info.component';
import {CreditAdviseComponent} from 'src/app/OAAdmin/credit-advise/credit-advise.component';
import { CopyAsModalComponent } from 'src/app/OAAdmin/OAPF/common/copy-as-modal/copy-as-modal.component';

const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-sbrmodal',
  templateUrl: './sbrmodal.component.html',
  styleUrls: ['./sbrmodal.component.scss']
})
export class SbrmodalComponent implements OnInit {
  formsCount = 3;
  account$: BehaviorSubject<Sbr> =
    new BehaviorSubject<Sbr>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private unsubscribe: Subscription[] = [];
  Sbrreq: Sbrreq
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  checkNextStage = true;
  modalOption: NgbModalOptions = {};
  @Output('displayedColumns') displayedColumns: any
  @Output('fDisplayedColumns') fDisplayedColumns: any;
  @ViewChild(SbrMainComponent) SbrMainComponent: SbrMainComponent;
  @ViewChild(SbrAmtInfoComponent) SbrAmtInfoComponent: SbrAmtInfoComponent;
  closeResult: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              public activeModal: NgbActiveModal,
              private authService: AuthService,
              public modalService: NgbModal,
              public sbragreementServices: sbragreementService) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<Sbr>, isFormValid: boolean) => {
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
      this.Sbrreq = new Sbrreq();
      /* this.Sbrreq.limitReference=this.account$.value.limitReference
       this.Sbrreq.limitTypeFlag=this.account$.value.limitTypeFlag
       this.Sbrreq.autoFinanceAvailability=this.account$.value.autoFinanceAvailability
      // this.Sbrreq.anchorCustomer=this.account$.value.anchorCustomer
       this.Sbrreq.counterPartyContactName=this.account$.value.counterPartyContactName
       this.Sbrreq.documentsRequired=this.account$.value.documentsRequired
       this.Sbrreq.counterPartyPOBox=this.account$.value.counterPartyPOBox
      // this.Sbrreq.counterParty=this.account$.value.counterParty
       this.Sbrreq.maxLoanPercentage=this.account$.value.maxLoanPercentage
       this.Sbrreq.anchorCustomerTelephone=this.account$.value.anchorCustomerTelephone
     //  this.Sbrreq.agreement=this.account$.value.agreement
       this.Sbrreq.appliedLimitCurrency=this.account$.value.appliedLimitCurrency
       this.Sbrreq.anchorCustomerContactName=this.account$.value.anchorCustomerContactName
       this.Sbrreq.limitCurrency=this.account$.value.limitCurrency
       this.Sbrreq.anchorCustomerEmail=this.account$.value.anchorCustomerEmail
       this.Sbrreq.anchorPartyAccountId=this.account$.value.anchorPartyAccountId
       this.Sbrreq.administrativeFeeAmount=this.account$.value.administrativeFeeAmount
       this.Sbrreq.factoringCommissionRate=this.account$.value.factoringCommissionRate
       this.Sbrreq.profitRateType=this.account$.value.profitRateType
       this.Sbrreq.managementFeeAmount=this.account$.value.managementFeeAmount
       this.Sbrreq.limitExpiry=this.account$.value.limitExpiry
       this.Sbrreq.cashMargin=this.account$.value.cashMargin
       this.Sbrreq.commercialContractDetails=this.account$.value.commercialContractDetails
       this.Sbrreq.counterPartyEmail=this.account$.value.counterPartyEmail
       this.Sbrreq.administrativeFeeCurrency=this.account$.value.administrativeFeeCurrency
       this.Sbrreq.autoFinancing=this.account$.value.autoFinancing
       this.Sbrreq.rebateAccount=this.account$.value.rebateAccount
       this.Sbrreq.managementFeeCurrency=this.account$.value.managementFeeCurrency
       this.Sbrreq.financingProfitMarginRate=this.account$.value.financingProfitMarginRate
       this.Sbrreq.appliedLimitAmount=this.account$.value.appliedLimitAmount
       this.Sbrreq.natureOfBusiness=this.account$.value.natureOfBusiness
       this.Sbrreq.earMarkReference=this.account$.value.earMarkReference
       this.Sbrreq.earlyPaymentAmount=this.account$.value.earlyPaymentAmount
       this.Sbrreq.invoiceServiceChargeAmount=this.account$.value.invoiceServiceChargeAmount
       this.Sbrreq.anchorCustomerAddressLine3=this.account$.value.anchorCustomerAddressLine3
       this.Sbrreq.anchorCustomerAddressLine1=this.account$.value.anchorCustomerAddressLine1
       this.Sbrreq.anchorCustomerAddressLine2=this.account$.value.anchorCustomerAddressLine2
       this.Sbrreq.invoiceServiceChargeCurrency=this.account$.value.invoiceServiceChargeCurrency
       this.Sbrreq.anchorCustomerFax=this.account$.value.anchorCustomerFax
       this.Sbrreq.recourseFlag=this.account$.value.recourseFlag
       this.Sbrreq.goodsDescription=this.account$.value.goodsDescription
       this.Sbrreq.directContactFlag=this.account$.value.directContactFlag
       this.Sbrreq.paymentTermsDays=this.account$.value.paymentTermsDays
       this.Sbrreq.counterPartyAddressLine1=this.account$.value.counterPartyAddressLine1
       this.Sbrreq.counterPartyAddressLine2=this.account$.value.counterPartyAddressLine2
       this.Sbrreq.counterPartyAddressLine3=this.account$.value.counterPartyAddressLine3
       this.Sbrreq.rebateRate=this.account$.value.rebateRate
       this.Sbrreq.transactionDate=this.account$.value.transactionDate
       this.Sbrreq.counterPartyAccountId=this.account$.value.counterPartyAccountId
       this.Sbrreq.paymentTermsCondition=this.account$.value.paymentTermsCondition
       this.Sbrreq.anchorCustomerPOBox=this.account$.value.anchorCustomerPOBox
       this.Sbrreq.limitAmount=this.account$.value.limitAmount
       this.Sbrreq.counterPartyTelephone=this.account$.value.counterPartyTelephone
       this.Sbrreq.financingInformation=this.account$.value.financingInformation
       this.Sbrreq.earlyPaymentFeeCurrency=this.account$.value.earlyPaymentFeeCurrency
       this.Sbrreq.sbrId=this.account$.value.sbrId
       this.Sbrreq.counterPartyFax=this.account$.value.counterPartyFax */
      this.Sbrreq = this.account$.value;
      // const sbrJsonStr = JSON.stringify(this.Sbrreq)
      console.log(this.Sbrreq);
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.sbragreementServices.dataItem(this.Sbrreq, this.mode).subscribe(res => {
          if (res !== null && res !== '') {
            this.checkNextStage = true;
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
      } else if (this.mode === 'edit') {
        this.checkNextStage = false;
        this.sbragreementServices.dataItem(this.Sbrreq, this.mode).subscribe(res => {
          console.log('Response is : ' + res)
          if (res !== null && res !== '') {
            this.checkNextStage = true;
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
        this.sbragreementServices.dataItem(Sbrreq, this.mode).subscribe(res => {
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

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  copyAs() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(CopyAsModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'copy';
    modalRef.componentInstance.functionType = 'admin';
    modalRef.componentInstance.url = '/oaadmin/api/v1/sbrs/';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      const refNo = this.SbrMainComponent.form.value.sbrId;
      console.log('Result is ' + result);
      //this.updateAccount(result, true)
      this.formValue = result
      console.log(this.formValue)
      //this.Invoicestep1Component.updateForm()
      this.formValue.sbrId = refNo
      this.SbrMainComponent.form.patchValue(this.formValue)
      this.SbrAmtInfoComponent.form.patchValue(this.formValue)
      this.SbrMainComponent.form.value.sbrId = refNo;
      //this.Invoicestep1Component.updateReferenceNumber();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAdvicePdf(mode: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //  this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'lg';
    const modalRef = this.modalService.open(CreditAdviseComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    //  modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
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
