import {Component, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {financing,inits} from "../../../Model/OAPF/Request/financing";
import {cFinancing} from "../../../Model/OAPF/CRequest/cFinancing";
import Swal from "sweetalert2";
import {financingService} from "../../../shared/OAPF/financing.service";

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

  constructor(public activeModal: NgbActiveModal, public financingService: financingService) {
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
    if (this.currentStep$.value === this.formsCount - 1) {
      this.cFinancing = new cFinancing();
      this.cFinancing = this.account$.value;
      const rmNewRequest = this.cFinancing;
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.financingService.dataItem(rmNewRequest,this.mode).subscribe(res => {
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
        this.financingService.dataItem(rmNewRequest,this.mode).subscribe(res => {
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
        this.financingService.dataItem(rmNewRequest,this.mode).subscribe(res => {
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

  updateAccount = (part: Partial<financing>, isFormValid: boolean) => {
    this.formElement = this.account$;
    const currentAccount = this.account$.value;
    const updatedAccount = {...currentAccount, ...part};
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

}
