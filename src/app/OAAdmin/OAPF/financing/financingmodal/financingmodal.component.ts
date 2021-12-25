import {Component, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {financing, inits} from "../../../Model/OAPF/Request/financing";
import {cFinancing} from "../../../Model/OAPF/CRequest/cFinancing";
import Swal from "sweetalert2";
import {financingService} from "../../../shared/OAPF/financing.service";
import {FormGroup} from "@angular/forms";
import {NotificationService} from "../../../shared/notification.service";

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

  constructor(public activeModal: NgbActiveModal,
              public financingService: financingService,
              public NotificationService: NotificationService) {
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
}
