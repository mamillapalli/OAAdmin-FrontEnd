import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import {corporateadmin,inits} from "../../../Model/OAAdmin/Request/corporateadmin";
import {NotificationService} from "../../../shared/notification.service";
import {DatePipe} from "@angular/common";
import Swal from "sweetalert2";
import {oaCommonService} from "../../../shared/oacommon.service";
import {ccorporateadmin} from "../../../Model/OAAdmin/CRequest/ccorporateadmin";

@Component({
  selector: 'app-corporateadminmodal',
  templateUrl: './corporateadminmodal.component.html',
  styleUrls: ['./corporateadminmodal.component.scss']
})
export class CorporateadminmodalComponent implements OnInit {

  formsCount = 2;
  account$: BehaviorSubject<any> = new BehaviorSubject<corporateadmin>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  errorMsg: string;
  private unsubscribe: Subscription[] = [];
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  ccorporateadmin: ccorporateadmin
  checkNextStage: boolean;

  constructor(public activeModal: NgbActiveModal,
              private authService: AuthService,
              public notifyService: NotificationService,
              public oaCommonService: oaCommonService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<corporateadmin>, isFormValid: boolean) => {
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
      this.ccorporateadmin = new ccorporateadmin();
      this.ccorporateadmin = this.account$.value;
      const rmNewRequest = this.ccorporateadmin;
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.oaCommonService.dataItem(rmNewRequest,'',this.mode,'oaadmin/api/v1/bankusers').subscribe(res => {
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
        this.oaCommonService.dataItem(rmNewRequest,rmNewRequest.userId,this.mode,'oaadmin/api/v1/bankusers').subscribe(res => {
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
        this.oaCommonService.dataItem(rmNewRequest,rmNewRequest.userId,this.mode,'oaadmin/api/v1/bankusers').subscribe(res => {
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


}
