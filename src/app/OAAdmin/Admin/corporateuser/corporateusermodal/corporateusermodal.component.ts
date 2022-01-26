import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {catchError, retry} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {corporateUser, inits} from "../../../Model/OAAdmin/Request/corporateUser";
import {Customerreq} from "../../../Model/customerreq";
import {corporateuserreq} from "../../../Model/corporateuserreq";
import {DatePipe, formatDate} from "@angular/common";
import {NotificationService} from "../../../shared/notification.service";
import Swal from "sweetalert2";
import {ccorporateUser} from "../../../Model/OAAdmin/CRequest/ccorporateuser";
import { oaCommonService } from "../../../shared/oacommon.service";
import {CopyAsModalComponent} from "../../../OAPF/common/copy-as-modal/copy-as-modal.component";
import {Corporateuserstep1Component} from "./corporateuserstep/corporateuserstep1/corporateuserstep1.component";
import {Corporateuserstep2Component} from "./corporateuserstep/corporateuserstep2/corporateuserstep2.component";

@Component({
  selector: 'app-corporateusermodal',
  templateUrl: './corporateusermodal.component.html',
  styleUrls: ['./corporateusermodal.component.scss']
})
export class CorporateusermodalComponent implements OnInit {

  formsCount = 1;
  account$: BehaviorSubject<any> = new BehaviorSubject<corporateUser>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errorMsg: string;
  private unsubscribe: Subscription[] = [];
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  ccorporateUser: ccorporateUser
  checkNextStage: boolean = true;
  closeResult: string;

  modalOption: NgbModalOptions = {};

  @ViewChild(Corporateuserstep1Component) Corporateuserstep1Component: Corporateuserstep1Component;
  @ViewChild(Corporateuserstep2Component) Corporateuserstep2Component: Corporateuserstep2Component;
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

  updateAccount = (part: Partial<corporateUser>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  modal: any;

  nextStep() {
    console.log('check validation')
    const nextStep = this.currentStep$.value;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.currentStep$.value === this.formsCount) {
      if( this.checkBusinessValidation()){
        return;
      }
      this.ccorporateUser = new ccorporateUser(this.account$.value);
      const rmNewRequest = this.ccorporateUser;
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.oaCommonService.dataItem(rmNewRequest,'',this.mode,'oaadmin/api/v1/customerusers').subscribe(res => {
          console.log('Response is : ' + res)
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
      } else if (this.mode === 'edit') {
        this.checkNextStage = false;
        this.oaCommonService.dataItem(rmNewRequest,rmNewRequest.userId,this.mode,'oaadmin/api/v1/customerusers').subscribe(res => {
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
      } else if (this.mode === 'auth') {
        this.checkNextStage = false;
        this.oaCommonService.dataItem(rmNewRequest,rmNewRequest.userId,this.mode,'oaadmin/api/v1/customerusers').subscribe(res => {
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
    modalRef.componentInstance.functionType = 'admin';
    modalRef.componentInstance.url = 'oaadmin/api/v1/customerusers';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      const refNo = this.Corporateuserstep1Component.corporateUserForm.value.userId;
      console.log('Result is ' + result);
      //this.updateAccount(result, true)
      this.formValue = result
      console.log(this.formValue)
      //this.Invoicestep1Component.updateForm()
      this.formValue.userId = refNo
      this.Corporateuserstep1Component.corporateUserForm.patchValue(this.formValue)
      this.Corporateuserstep1Component.corporateUserForm.value.userId = refNo;
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
