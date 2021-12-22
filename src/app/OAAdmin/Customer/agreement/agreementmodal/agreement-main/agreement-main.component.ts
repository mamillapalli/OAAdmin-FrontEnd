import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Subscription, throwError} from 'rxjs';
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {Agreement} from "../../../../Model/agreement";
import {MatTableDataSource} from "@angular/material/table";
import {Corporateuser} from "../../../../Model/corporateuser";
import {Customer} from "../../../../Model/customer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { CustomerService } from 'src/app/OAAdmin/shared/customer.service';
import { rm } from 'src/app/OAAdmin/Model/request/rm';


@Component({
  selector: 'app-agreement-main',
  templateUrl: './agreement-main.component.html',
  styleUrls: ['./agreement-main.component.scss']
})
export class AgreementMainComponent implements OnInit {

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Agreement>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Agreement>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<Corporateuser>();
  rmdataSource: any = new MatTableDataSource<rm>();
  public custDisplayColumns: string[] = ['customerId','name','addressLine1'];
  public rmDisplayColumns: string[] = ['rmId','firstname'];
 
  clickedRows = new Set<Customer>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  public closeResult: string;

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,private datePipe: DatePipe,
    private customerService:CustomerService) {}

  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      contractReferenceNumber: [this.defaultValues.contractReferenceNumber,[Validators.required]],
      businessType: [this.defaultValues.businessType,[Validators.required]],
      anchorCustomer: [this.defaultValues.anchorCustomer,[Validators.required]],
      contractDocumentNumber: [this.defaultValues.contractDocumentNumber,[Validators.required]],
      transactionDate: [this.defaultValues.transactionDate,[Validators.required]],
      validDate: [this.defaultValues.validDate,[Validators.required]],
      expiryDate: [this.defaultValues.expiryDate,[Validators.required]],
      rm: [this.defaultValues.rm,[Validators.required]],
      remarks: [this.defaultValues.remarks,[Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
      this.form.markAllAsTouched();
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('contractReferenceNumber')?.hasError('required') ||
      this.form.get('businessType')?.hasError('required') ||
      this.form.get('anchorCustomer')?.hasError('required') ||
      this.form.get('contractDocumentNumber')?.hasError('required') ||
      this.form.get('validDate')?.hasError('required') ||
      this.form.get('expiryDate')?.hasError('required') ||
      this.form.get('transactionDate')?.hasError('required') ||
      this.form.get('rm')?.hasError('required') ||
      this.form.get('remarks')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.contractReferenceNumber.setValue(this.formValue.contractReferenceNumber);
    this.f.businessType.setValue(this.formValue.businessType);
    this.f.anchorCustomer.setValue(this.formValue.anchorCustomer);
    this.f.contractDocumentNumber.setValue(this.formValue.contractDocumentNumber);
    this.f.rm.setValue(this.formValue.rm);
    this.f.remarks.setValue(this.formValue.remarks);
    const evalidDate = this.datePipe.transform(new Date(this.formValue.validDate), "yyyy-MM-dd");
    this.f.validDate.setValue(evalidDate);
    const eTransDate = this.datePipe.transform(new Date(this.formValue.transactionDate), "yyyy-MM-dd");
    this.f.transactionDate.setValue(eTransDate);
    const expDate = this.datePipe.transform(new Date(this.formValue.expiryDate), "yyyy-MM-dd");
    this.f.expiryDate.setValue(expDate);
   }

  get f() {
    return this.form.controls;
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
    const control = this.form.controls[controlName];
    return control.dirty || control.touched;
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


  openCustomerDialog(content: any) {
    this.getCustomerList();
    console.log(this.dataSource.data)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    this.modalService.open(content, this.modalOption).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result) {
        console.log("row result is "+result)
        this.f.anchorCustomer.setValue(result.customerId);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public getRMList() {
    console.log('Get rm')
    const sb =  this.customerService.getAllRMS().subscribe((res) => {
      console.log('Anil Customer List',res);
      this.rmdataSource.data = res;
      this.rmdataSource.sort = this.sort;
      this.rmdataSource.paginator = this.paginator;
      this.rmdataSource.filterPredicate = this.createFilter();
    });
  }


  openRMDialog(content: any) {
    this.getRMList();
    console.log('Anil',this.rmdataSource.data)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    this.modalService.open(content, this.modalOption).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result) {
          console.log("row result is "+result)
       // this.f.rm.setValue(result.rmId);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);
      }
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
