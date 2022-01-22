import {Component, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {inits, rm} from "../../../Model/OAAdmin/Request/rm";
import {crm} from "../../../Model/OAAdmin/CRequest/crm";
import {DatePipe} from "@angular/common";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import Swal from 'sweetalert2';
import {NotificationService} from "../../../shared/notification.service";
import {oaCommonService} from "../../../shared/oacommon.service";
import {CopyAsModalComponent} from "../../../OAPF/common/copy-as-modal/copy-as-modal.component";
import {Relationshipmanagerstep1Component} from "./steps/relationshipmanagerstep1/relationshipmanagerstep1.component";
import {Relationshipmanagerstep2Component} from "./steps/relationshipmanagerstep2/relationshipmanagerstep2.component";

@Component({
  selector: 'app-relationshipmanagermodal',
  templateUrl: './relationshipmanagermodal.component.html',
  styleUrls: ['./relationshipmanagermodal.component.scss']
})
export class RelationshipmanagermodalComponent implements OnInit, OnDestroy {

  formsCount = 2;
  account$: BehaviorSubject<any> = new BehaviorSubject<rm>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errorMsg: string;
  unsubscribe: Subscription[] = [];
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  crm: crm
  checkNextStage: boolean;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  @ViewChild(Relationshipmanagerstep1Component) Relationshipmanagerstep1Component: Relationshipmanagerstep1Component;
  @ViewChild(Relationshipmanagerstep2Component) Relationshipmanagerstep2Component: Relationshipmanagerstep2Component;
  @Output('displayedColumns') displayedColumns: any
  @Output('fDisplayedColumns') fDisplayedColumns: any

  constructor(public activeModal: NgbActiveModal,
              private authService: AuthService,
              public notifyService: NotificationService,
              public oaCommonService: oaCommonService,
              private datePipe: DatePipe,
              public modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<rm>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  modal: any;

  nextStep() {
    console.log('check validation')
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.currentStep$.value === this.formsCount - 1) {
      if( this.checkBusinessValidation()){
        return;
      }
      this.crm = new crm();
      this.crm = this.account$.value;
      const rmNewRequest = this.crm;
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.oaCommonService.dataItem(rmNewRequest,'',this.mode,'oaadmin/api/v1/rms').subscribe(res => {
          console.log('Response is : ' + res)
          if (res !== undefined) {
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
      } else if (this.mode === 'edit') {
        this.checkNextStage = false;
        this.oaCommonService.dataItem(rmNewRequest,rmNewRequest.rmId,this.mode,'oaadmin/api/v1/rms').subscribe(res => {
          console.log('Response is : ' + res)
          if (res !== undefined) {
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
      } else if (this.mode === 'auth') {
        this.checkNextStage = false;
        this.oaCommonService.dataItem(rmNewRequest,rmNewRequest.rmId,this.mode,'oaadmin/api/v1/rms').subscribe(res => {
          if (res !== undefined) {
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

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  private checkBusinessValidation(): boolean {
    let currentDate:any = new Date();
    currentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    if(this.account$.value.expiryDate < currentDate){
      this.notifyService.showWarning('Expiry Date should not less than today Date','Business Validation')
      return true;
    }
    if(this.account$.value.effectiveDate < currentDate){
      this.notifyService.showWarning('Effective Date should not less than today Date','Business Validation')
      return true;
    }
    if(this.account$.value.expiryDate < this.account$.value.effectiveDate){
      this.notifyService.showWarning('Expiry should not less than today Date','Business Validation')
      return true;
    }
    return false
  }

  copyAs() {
    console.log(this.displayedColumns)
    console.log(this.fDisplayedColumns)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(CopyAsModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'copy';
    modalRef.componentInstance.functionType = 'rms';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      const refNo = this.Relationshipmanagerstep1Component.rmForm.value.rmId;
      console.log('Result is ' + result);
      //this.updateAccount(result, true)
      this.formValue = result
      console.log(this.formValue)
      //this.Invoicestep1Component.updateForm()
      this.formValue.rmId = refNo
      this.Relationshipmanagerstep1Component.rmForm.patchValue(this.formValue)
      this.Relationshipmanagerstep1Component.rmForm.value.rmId = refNo;
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
