import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import Swal from "sweetalert2";
import { OODataServce } from 'src/app/OAAdmin/shared/oadata.service';
import { InterestRate,inits } from 'src/app/ReqModal/interestrate';
import { InterestRateReq } from 'src/app/ReqModal/interestrateReq';
import { InterestRateMainComponent } from './interest-rate-main/interest-rate-main.component';
import { NotificationService } from 'src/app/OAAdmin/shared/notification.service';
import { CopyAsModalComponent } from 'src/app/OAAdmin/OAPF/common/copy-as-modal/copy-as-modal.component';


@Component({
  selector: 'app-interest-rate-modal',
  templateUrl: './interest-rate-modal.component.html',
  styleUrls: ['./interest-rate-modal.component.scss']
})
export class InterestRateModalComponent implements OnInit {
  formsCount = 1;
  account$: BehaviorSubject<InterestRate> = new BehaviorSubject<InterestRate>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private unsubscribe: Subscription[] = [];
  intRate: InterestRate
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  checkNextStage = true;
  @ViewChild(InterestRateMainComponent) InterestRateMainComponent: InterestRateMainComponent;
  @Output('displayedColumns') displayedColumns: any
  @Output('fDisplayedColumns') fDisplayedColumns: any
  modalOption: NgbModalOptions = {};
  closeResult: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              public activeModal: NgbActiveModal,
              private authService: AuthService,
              public ooDataService:OODataServce,
              public notifyService: NotificationService,
              public modalService: NgbModal) {}

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<InterestRate>, isFormValid: boolean) => {
    const intRate = this.account$.value;
    const updatedAccount = { ...intRate, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  nextStep() {
    const nextStep = this.currentStep$.value;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.currentStep$.value === this.formsCount) {
      this.intRate = new InterestRateReq();
      this.intRate.name = this.account$.value.name
      this.intRate.description = this.account$.value.description
      this.intRate.rateValue = this.account$.value.rateValue
      this.intRate.deleteFlag = this.account$.value.deleteFlag
      const intReq = this.intRate;
      console.log(intReq);
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.ooDataService.OODataCall(intReq,this.mode,'INT').subscribe(res => {
          if (res !== null && res !== '') {
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
        this.ooDataService.OODataCall(intReq,this.mode,'INT').subscribe(res => {
          console.log('Response is : '+res)
          if (res !== null && res !== '') {
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
        this.ooDataService.OODataCall(intReq,this.mode,'INT').subscribe(res => {
          console.log('Response is : '+res)
          if (res !== undefined) {
            this.checkNextStage = true;
            Swal.fire({
              title: 'Authorized Successfully',
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
    console.log(this.displayedColumns)
    console.log(this.fDisplayedColumns)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(CopyAsModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'copy';
    modalRef.componentInstance.functionType = 'admin';
    modalRef.componentInstance.url = '/oadata/api/v1/interestRates';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result: any) => {
      this.formValue = result
      this.InterestRateMainComponent.InterestForm.patchValue(this.formValue)
      console.log(this.formValue)
    }, (reason: any) => {
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
