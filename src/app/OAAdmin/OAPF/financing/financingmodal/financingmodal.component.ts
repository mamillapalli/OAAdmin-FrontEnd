import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {financing, inits} from "../../../Model/OAPF/Request/financing";
import {cFinancing} from "../../../Model/OAPF/CRequest/cFinancing";
import Swal from "sweetalert2";
import {financingService} from "../../../shared/OAPF/financing.service";
import {FormGroup} from "@angular/forms";
import {NotificationService} from "../../../shared/notification.service";
import {CorporateadminmodalComponent} from "../../../Admin/corporateadmin/corporateadminmodal/corporateadminmodal.component";
import {VouchermodalComponent} from "../../common/vouchermodal/vouchermodal.component";
import {InvoiceDOComponent} from "../../common/invoice-do/invoice-do.component";
import {Financingstep2Component} from "./steps/financingstep2/financingstep2.component";
import {Financingstep1Component} from "./steps/financingstep1/financingstep1.component";
import {CopyAsModalComponent} from "../../common/copy-as-modal/copy-as-modal.component";

@Component({
  selector: 'app-financingmodal',
  templateUrl: './financingmodal.component.html',
  styleUrls: ['./financingmodal.component.scss']
})
export class FinancingmodalComponent implements OnInit {
  formsCount = 3;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  account$: BehaviorSubject<financing> = new BehaviorSubject<financing>(inits);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output() mode: any;
  @Output() formValue: any
  @Output() formElement: any
  fromParent: any;
  checkNextStage = true;
  cFinancing: cFinancing;
  @Output() calculatedDetails: any
  modalOption: NgbModalOptions = {};
  @ViewChild(Financingstep1Component) Financingstep1Component: Financingstep1Component;
  @ViewChild(Financingstep2Component) Financingstep2Component: Financingstep2Component;
  @Output('displayedColumns') displayedColumns: any
  @Output('fDisplayedColumns') fDisplayedColumns: any
  @Output('functionType') functionType: any
  closeResult: string;

  constructor(public activeModal: NgbActiveModal,
              public financingService: financingService,
              public NotificationService: NotificationService,
              public modalService: NgbModal) {
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
        this.financingService.CalculateFinanceDetails(this.account$.value).subscribe((res: any) => {
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
      const res = this.checkBusinessValidation();
      if(res){
        return;
      }
      this.cFinancing = new cFinancing();
      this.cFinancing = this.account$.value;
      const rmNewRequest = this.cFinancing;
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.financingService.dataItem(rmNewRequest, this.mode).subscribe(res => {
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
        this.financingService.dataItem(rmNewRequest, this.mode).subscribe(res => {
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
        this.financingService.dataItem(rmNewRequest, this.mode).subscribe(res => {
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

  updateAccount = (part: Partial<financing>, isFormValid: boolean) => {
    this.formElement = this.account$;
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
    this.calculatedDetails = this.account$.value;
  };

  private checkBusinessValidation():boolean {
    console.log('checkBusinessValidation');
    if(this.account$.value.financeAmount > this.account$.value.totalAvailableAmount)
    {
      this.NotificationService.showError('Finance should not greater than Total Available Amount','Business Validation')
      return true
    }
    return false
  }

  viewVoucher() {

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(VouchermodalComponent, this.modalOption);
    modalRef.componentInstance.voucherData = this.account$.value;
    modalRef.result.then((result) => {
    }, (reason) => {
    });

  }

  copyAs() {
    console.log('display column is :'+this.displayedColumns)
    console.log('display column is :'+this.fDisplayedColumns)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(CopyAsModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'copy';
    modalRef.componentInstance.functionType = 'finances';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      const refNo = this.Financingstep1Component.financingForm.value.financeId;
      console.log('Result is ' + result);
      //this.updateAccount(result, true)
      this.formValue = result
      console.log(this.formValue)
      //this.Invoicestep1Component.updateForm()
      this.formValue.financeId = refNo
      this.Financingstep1Component.financingForm.patchValue(this.formValue)
      this.Financingstep1Component.financingForm.value.financeId = refNo;
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
