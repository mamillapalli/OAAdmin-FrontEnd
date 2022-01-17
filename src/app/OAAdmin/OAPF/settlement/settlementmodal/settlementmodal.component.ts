import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {cPayment} from "../../../Model/OAPF/CRequest/cPayment";
import {paymentService} from "../../../shared/OAPF/payment.service";
import {inits, Payment} from "../../../Model/OAPF/Request/payment";
import {InvoiceDOComponent} from "../../common/invoice-do/invoice-do.component";
import {Settlementstep1Component} from "./steps/settlementstep1/settlementstep1.component";
import {Settlementstep2Component} from "./steps/settlementstep2/settlementstep2.component";
import {CopyAsModalComponent} from "../../common/copy-as-modal/copy-as-modal.component";
import {VouchermodalComponent} from "../../common/vouchermodal/vouchermodal.component";
@Component({
  selector: 'app-settlementmodal',
  templateUrl: './settlementmodal.component.html',
  styleUrls: ['./settlementmodal.component.scss']
})
export class SettlementmodalComponent implements OnInit {

  formsCount = 3;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  account$: BehaviorSubject<Payment> = new BehaviorSubject<Payment>(inits);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output() mode: any;
  @Output() formValue: any
  @Output() formElement: any
  fromParent: any;
  checkNextStage = true;
  cPayment: cPayment;
  @Output() calculatedDetails: any

  modalOption: NgbModalOptions = {};
  closeResult: string;
  @ViewChild(Settlementstep1Component) Settlementstep1Component: Settlementstep1Component;
  @ViewChild(Settlementstep2Component) Settlementstep2Component: Settlementstep2Component;
  @Output('displayedColumns') displayedColumns: any
  @Output('fDisplayedColumns') fDisplayedColumns: any

  constructor(public activeModal: NgbActiveModal, public paymentServices: paymentService,public modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }


  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    if (nextStep === 2) {
      if (this.mode === 'new' || this.mode === 'edit') {
        this.checkNextStage = false;
        this.cPayment = new cPayment(this.account$.value);
        const rmNewRequest = this.cPayment;
        console.log('calaculate payment details')
        this.paymentServices.CalculatePaymentDetails(rmNewRequest).subscribe((res: any) => {
            console.log('response invoice calculate details is ' + res)
            if (res != null) {
              this.calculatedDetails = res
              this.currentStep$.next(nextStep);
            } else {
              console.log('No Calculation is found')
            }
          }, (err: any) => console.log('HTTP Error', err),
          () => console.log('HTTP request completed.'))
      }
    }
    if (this.currentStep$.value === this.formsCount - 1) {
      this.cPayment = new cPayment(this.account$.value);
      //this.cPayment = this.account$.value;
      const rmNewRequest = this.cPayment;
      console.log('this.cPayment '+this.cPayment)
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.paymentServices.dataItem(rmNewRequest,this.mode).subscribe(res => {
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
            if(this.checkNextStage) {
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
        this.paymentServices.dataItem(rmNewRequest,this.mode).subscribe(res => {
          console.log('Response is : '+res)
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
          if(res !== null && res !== '') {
            if(this.checkNextStage) {
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
        this.paymentServices.dataItem(rmNewRequest,this.mode).subscribe(res => {
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
            if(this.checkNextStage) {
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
    if(this.checkNextStage) {
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

  updateAccount = (part: Partial<Payment>, isFormValid: boolean) => {
    this.formElement = this.account$;
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
    this.calculatedDetails = this.account$.value;
  };

  copyAs() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(CopyAsModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'copy';
    modalRef.componentInstance.functionType = 'payments';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      const refNo = this.Settlementstep1Component.paymentForm.value.paymentId;
      console.log('Result is ' + result);
      //this.updateAccount(result, true)
      this.formValue = result
      console.log(this.formValue)
      //this.Invoicestep1Component.updateForm()
      this.formValue.paymentId = refNo
      this.Settlementstep1Component.paymentForm.patchValue(this.formValue)
      this.Settlementstep1Component.paymentForm.value.paymentId = refNo;
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

  viewVoucher() {
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      this.modalOption.size = 'xl'
      const modalRef = this.modalService.open(VouchermodalComponent, this.modalOption);
      modalRef.componentInstance.voucherData = this.account$.value;
      modalRef.componentInstance.methodType = "payments";
      modalRef.result.then((result) => {
      }, (reason) => {
      });
  }
}
