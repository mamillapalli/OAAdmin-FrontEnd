import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../modules/auth";
import Swal from "sweetalert2";
import { OODataServce } from 'src/app/OAAdmin/shared/oadata.service';
import { Currency, inits } from 'src/app/ReqModal/currency';
import { CurrencyReq } from 'src/app/ReqModal/currencyreq';

  @Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.scss']
})
export class CurrencyModalComponent implements OnInit {

  formsCount = 2;
  account$: BehaviorSubject<Currency> = new BehaviorSubject<Currency>(inits);
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private unsubscribe: Subscription[] = [];
  currency: Currency
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

  updateAccount = (part: Partial<Currency>, isFormValid: boolean) => {
    const currency = this.account$.value;
    const updatedAccount = { ...currency, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  nextStep() {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      return;
    }
    if (this.currentStep$.value === this.formsCount - 1) {
      this.currency = new CurrencyReq();
      this.currency.isoCode = this.account$.value.isoCode
      this.currency.description = this.account$.value.description
      this.currency.country = this.account$.value.country
      this.currency.minorName = this.account$.value.minorName
      this.currency.majorName = this.account$.value.majorName
      this.currency.decimal = this.account$.value.decimal
      this.currency.baseDays = this.account$.value.baseDays


      //this.cInvoice.status = this.account$.value.status

      //const rmNewRequest = JSON.stringify(this.cInvoice)
      const currencyRequest = this.currency;
      console.log(currencyRequest);
      if (this.mode === 'new') {
        this.checkNextStage = false;
        this.ooDataService.OODataCall(currencyRequest,this.mode,'currency').subscribe(res => {
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
        this.ooDataService.OODataCall(currencyRequest,this.mode,'currency').subscribe(res => {
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
        this.ooDataService.OODataCall(currencyRequest,this.mode,'currency').subscribe(res => {
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
      //this.modalOption.windowClass = 'my-class'
      this.modalOption.size = 'xl'
      const modalRef = this.modalService.open(CopyAsModalComponent, this.modalOption);
      modalRef.componentInstance.mode = 'copy';
      modalRef.componentInstance.functionType = 'admin';
      modalRef.componentInstance.url = '/oaadmin/api/v1/accounts';
      modalRef.componentInstance.displayedColumns = this.displayedColumns;
      modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
      modalRef.result.then((result) => {
        const refNo = this.Accountstep1Component.accountsForm.value.userId;
        console.log('Result is ' + result);
        //this.updateAccount(result, true)
        this.formValue = result
        console.log(this.formValue)
        //this.Invoicestep1Component.updateForm()
        this.formValue.accountId = refNo
        this.Accountstep1Component.accountsForm.patchValue(this.formValue)
        this.Accountstep1Component.accountsForm.value.accountId = refNo;
        //this.Invoicestep1Component.updateReferenceNumber();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }
