import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import Swal from "sweetalert2";
import { OODataServce } from 'src/app/OAAdmin/shared/oadata.service';
import { ExchangeRate,inits } from 'src/app/ReqModal/exchangerate';
import { ExchangeRateReq } from 'src/app/ReqModal/exchangerateReq';

@Component({
  selector: 'app-exchange-rate-modal',
  templateUrl: './exchange-rate-modal.component.html',
  styleUrls: ['./exchange-rate-modal.component.scss']
})
export class ExchangeRateModalComponent implements OnInit {

  formsCount = 2;
  account$: BehaviorSubject<ExchangeRate> = new BehaviorSubject<ExchangeRate>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private unsubscribe: Subscription[] = [];
  exchRate: ExchangeRate
  @Input() mode: any;
  @Output() formValue: any
  fromParent: any;
  checkNextStage = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              public activeModal: NgbActiveModal,
              private authService: AuthService,
              public ooDataService:OODataServce) {}

  ngOnInit(): void {
    if (this.mode !== 'new') {
      this.formValue = this.fromParent;
    }
  }

  updateAccount = (part: Partial<ExchangeRate>, isFormValid: boolean) => {
    const exchRate = this.account$.value;
    const updatedAccount = { ...exchRate, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.currentStep$.value === this.formsCount - 1) {
      this.exchRate = new ExchangeRateReq();
      this.exchRate.fromCurrency = this.account$.value.fromCurrency
      this.exchRate.toCurrency = this.account$.value.toCurrency
      this.exchRate.rateValue = this.account$.value.rateType
      this.exchRate.rateValue = this.account$.value.rateValue
      this.exchRate.mdFlag = this.account$.value.mdFlag
      const exchReq = this.exchRate;
      console.log(exchReq);
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.ooDataService.OODataCall(exchReq,this.mode,'EXCH').subscribe(res => {
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
        this.ooDataService.OODataCall(exchReq,this.mode,'EXCH').subscribe(res => {
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
        this.ooDataService.OODataCall(exchReq,this.mode,'EXCH').subscribe(res => {
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

}

