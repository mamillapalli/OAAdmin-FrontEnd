import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Sbr} from "../../../../Model/sbr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../../Model/OAAdmin/Request/corporateUser";
import {Customer} from "../../../../Model/customer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {currencyList} from "../../../../shared/currency";
import { CustomerService } from 'src/app/OAAdmin/shared/customer.service';
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {sbragreementService} from "../../../../shared/sbragreement.service";
import { CustomerDOComponent } from 'src/app/OAAdmin/common/customer-do/customer-do.component';
import { AgreementDoComponent } from 'src/app/OAAdmin/common/agreement-do/agreement-do.component';
import { oapfcommonService } from 'src/app/OAAdmin/shared/oapfcommon.service';
import { Agreementreq } from 'src/app/OAAdmin/Model/agreementreq';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-sbr-main',
  templateUrl: './sbr-main.component.html',
  styleUrls: ['./sbr-main.component.scss']
})
export class SbrMainComponent implements OnInit {
  public gfg = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Sbr>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Sbr>;
  agreementReq: Agreementreq;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  public displayedColumns: string[] = ['customerId','name','addressLine1'];
  clickedRows = new Set<Customer>();
  public currencyList:any = currencyList;
  public closeResult: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  ReadOnlyCheckBox: boolean;

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,
    private datePipe: DatePipe,public sbragreementServices: sbragreementService,
    public customerService:CustomerService, public oapfcommonService:oapfcommonService ) {}

  ngOnInit() {
    this.initForm();
    this.agreementReq = new Agreementreq();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    } else if (this.mode == 'new'){
      this.oapfcommonService.getAdminReferenceNumber('sbrs').subscribe((res) => {
        this.f.sbrId.setValue(res);
      });
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      sbrId: [this.defaultValues.sbrId,[Validators.required]],
      anchorCustomer: ['',[Validators.required]],
      anchorCustomerId :['',[Validators.required]],
      rm:['',[Validators.required]],
      rmId:['',[Validators.required]],
      counterParty:['',[Validators.required]],
      counterPartyId:['',[Validators.required]],
      agreement:['',[Validators.required]],
      agreementId : ['',[Validators.required]],
      expiryDate: [this.defaultValues.expiryDate, [Validators.required]],
      directContactFlag: [this.defaultValues.directContactFlag,[Validators.required]],
      recourseFlag: [this.defaultValues.recourseFlag,[Validators.required]],
      limitTypeFlag: [this.defaultValues.limitTypeFlag,[Validators.required]],
      natureOfBusiness: [this.defaultValues.natureOfBusiness,[Validators.required]],
      goodsDescription: [this.defaultValues.goodsDescription,[Validators.required]],
      limitCurrency: [this.defaultValues.limitCurrency,[Validators.required]],
      limitAmount: [this.defaultValues.limitAmount,[Validators.required]],
      transactionDate: [this.defaultValues.transactionDate,[Validators.required]],
      paymentTermsDays: [this.defaultValues.paymentTermsDays,[Validators.required]],
      autoFinanceAvailability: [this.defaultValues.autoFinanceAvailability,[Validators.required]],
      autoFinancing: [this.defaultValues.autoFinancing,[Validators.required]],
      anchorPartyAccountId: [this.defaultValues.anchorPartyAccountId,[Validators.required]],
      counterPartyAccountId: [this.defaultValues.counterPartyAccountId,[Validators.required]],
      paymentTermsCondition: [this.defaultValues.paymentTermsCondition,[Validators.required]],
      commercialContractDetails: [this.defaultValues.commercialContractDetails,[Validators.required]],
      interestChargeType: [this.defaultValues.interestChargeType,[Validators.required]],
      interestRateType: [this.defaultValues.interestRateType,[Validators.required]],
      interestRate: [this.defaultValues.interestRate,[Validators.required]],
      interestMargin: [this.defaultValues.interestMargin,[Validators.required]],

    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
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
  checkForm() {
    return !(
      this.form.get('sbrId')?.hasError('required')
      );
  }

  updateForm()
  {
    this.form.patchValue(this.formValue)
    this.f.anchorCustomerId.setValue(this.formValue.anchorCustomer['customerId']);
    this.f.anchorCustomer.setValue(this.formValue.anchorCustomer);
    this.f.agreementId.setValue(this.formValue.agreement['contractReferenceNumber'])
    this.f.agreement.setValue(this.formValue.agreement);
    this.f.rmId.setValue(this.formValue.rm.rmId);
    this.f.rm.setValue(this.formValue.rm);
    this.f.counterPartyId.setValue(this.formValue.counterParty['customerId']);
    this.f.counterParty.setValue(this.formValue.counterParty);
  }

  public getCustomerList() {
    console.log('Get Customer')
    const sb =  this.customerService.getCustomers().subscribe((res) => {
      console.log('Anil Customer List',res);
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
    });
  }
  get f() {
    return this.form.controls;
  }

  openCustomerDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size='lg';
    const modalRef = this.modalService.open(CustomerDOComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.form.patchValue(result);
      if (result) {
        console.log("row result is "+result)
        this.f.anchorCustomer.setValue(result.customerId);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);

      }
    }, (reason) => {
      console.log('reason is'+reason);
    });
  }

  openAgreementModal() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size='xl';
    const modalRef = this.modalService.open(AgreementDoComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.form.patchValue(result);
      if (result) {
        console.log("row result is "+result)
        this.f.anchorCustomerId.setValue(result.anchorCustomer['customerId']);
        this.f.anchorCustomer.setValue(result.anchorCustomer)
        this.f.agreementId.setValue(result.contractReferenceNumber);
        this.agreementReq.contractReferenceNumber = result.contractReferenceNumber;
        this.f.agreement.setValue(this.agreementReq);
        this.f.rmId.setValue(result.rm['rmId']);
        this.f.rm.setValue(result.rm);
        this.f.counterPartyId.setValue(result.counterParties[0]['customerId']);
        this.f.counterParty.setValue(result.counterParties[0]);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);

      }
    }, (reason) => {
      console.log('reason is'+reason);
    });
  }

  isControlValid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.form.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    // const control = this.form.controls[controlName];
    return false;
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data: { firstName: string; }, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.firstName.toLowerCase().indexOf(searchTerms.firstName) !== -1
    }
    return filterFunction;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

