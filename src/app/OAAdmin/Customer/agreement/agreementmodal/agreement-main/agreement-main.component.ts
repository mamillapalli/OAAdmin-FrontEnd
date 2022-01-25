import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, throwError } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { Agreement } from "../../../../Model/agreement";
import { MatTableDataSource } from "@angular/material/table";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Customer } from "../../../../Model/customer";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CustomerService } from 'src/app/OAAdmin/shared/customer.service';
import { rm } from 'src/app/OAAdmin/Model/OAAdmin/Request/rm';
import { CustomerDOComponent } from 'src/app/OAAdmin/common/customer-do/customer-do.component';
import { RmDoComponent } from 'src/app/OAAdmin/common/rm-do/rm-do.component';
import { SelectionModel } from "@angular/cdk/collections";
import { oapfcommonService } from 'src/app/OAAdmin/shared/oapfcommon.service';
import { BusinessTypeReq } from 'src/app/OAAdmin/Model/businessTypeReq';
import { CreditAdviseComponent } from 'src/app/OAAdmin/credit-advise/credit-advise.component';
import {CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


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
  isPrintable = false;
  @Input() defaultValues: Partial<Agreement>;
  selection = new SelectionModel<Element>(true, []);
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue: any;
  @Input() mode: any;
  @ViewChild('capture')capture:ElementRef;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  corporateList: any;
  authToken: any;
  businessTypeReq: BusinessTypeReq;
  dataSource: any = new MatTableDataSource<Customer>();
  rmdataSource: any = new MatTableDataSource<rm>();
  public custDisplayColumns: string[] = ['customerId', 'name', 'addressLine1'];
  public rmDisplayColumns: string[] = ['rmId', 'firstname'];
  counterParties: FormArray = this.fb.array([]);
  clickedRows = new Set<Customer>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  public closeResult: string;
  private subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['customerId', 'name', 'emailAddress', 'expiryDate', 'status', 'actions'];


  constructor(private http: HttpClient, private fb: FormBuilder, public modalService: NgbModal, private datePipe: DatePipe,
    private customerService: CustomerService, private oapfcommonService: oapfcommonService) { }

  ngOnInit() {
    this.businessTypeReq = new BusinessTypeReq();
    this.initForm();
    if (this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view') {
      this.form.disable()
    } else if (this.mode !== 'new') {
      this.updateForm();
    } else if (this.mode == 'new') {
      this.oapfcommonService.getAdminReferenceNumber('agreements').subscribe((res) => {
        this.f.contractReferenceNumber.setValue(res);
        this.f.contractDocumentNumber.setValue(res);
      });
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      contractReferenceNumber: ['', [Validators.required]],
      businessType: [[Validators.required]],
      businessTypeId: [],
      anchorCustomer: [[Validators.required]],
      anchorCustomerId: [],
      contractDocumentNumber: [this.defaultValues.contractDocumentNumber, [Validators.required]],
      transactionDate: [this.defaultValues.transactionDate, [Validators.required]],
      validDate: [this.defaultValues.validDate, [Validators.required]],
      expiryDate: [this.defaultValues.expiryDate, [Validators.required]],
      rmId: [],
      rm: [[Validators.required]],
      remarks: [this.defaultValues.remarks, [Validators.required]],
      counterParties: this.counterParties
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
      this.form.markAllAsTouched();
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
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

  updateForm() {
    this.form.patchValue(this.formValue)
    // this.f.contractReferenceNumber.setValue(this.formValue.contractReferenceNumber);
    // this.f.businessType.setValue(this.formValue.businessType);
    // this.f.anchorCustomer.setValue(this.formValue.anchorCustomer);
    // this.f.contractDocumentNumber.setValue(this.formValue.contractDocumentNumber);
    // this.f.rmId.setValue(this.formValue.rm.rmId);
    // this.f.remarks.setValue(this.formValue.remarks);
    // const evalidDate = this.datePipe.transform(new Date(this.formValue.validDate), "yyyy-MM-dd");
    // this.f.validDate.setValue(evalidDate);
    // const eTransDate = this.datePipe.transform(new Date(this.formValue.transactionDate), "yyyy-MM-dd");
    // this.f.transactionDate.setValue(eTransDate);
    // const expDate = this.datePipe.transform(new Date(this.formValue.expiryDate), "yyyy-MM-dd");
    // this.f.expiryDate.setValue(expDate);
    // const customerList = this.formValue.anchorCustomer;
    // this.f.anchorCustomerId.setValue(customerList.customerId);
    // this.f.rm.setValue(this.formValue.rm);
    // this.f.businessTypeId.setValue(this.formValue.businessType.name);
    if (this.formValue.counterParties.length > 0) {
      this.dataSource.data = this.formValue.counterParties;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    // this.f.businessType.setValue(this.businessTypeReq.name);
    console.log('business Type ---->', this.businessTypeReq);
    //  this.form.patchValue(this.formValue)
  }


  onBusinessTypeChange(event: any): any {
    console.log(event.target.value);
    this.businessTypeReq.name = event.target.value;
    this.f.businessType.setValue(this.businessTypeReq);
    console.log(this.f.businessType);
    //this.businessType.name(this.formValue.businessTypeId);
  }

  onAnchorCustChange(event: any): any {
    console.log(event.target.value);
    this.customerService.getCustomerById(event.target.value).subscribe((res) => {
    //this.businessType.name(this.formValue.businessTypeId);
    this.f.anchorCustomerId.setValue(res.customerId);
    this.f.anchorCustomer.setValue(res);
  });
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
    let filterFunction = function (data: { firstName: string; }, filter: string): boolean {
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


  openCustomerDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
   // this.modalOption.windowClass = 'my-class'
   this.modalOption.size='lg';
    const modalRef = this.modalService.open(CustomerDOComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.form.patchValue(result);
      if (result) {
        console.log("row result is " + result)
        this.f.anchorCustomerId.setValue(result.customerId);
        this.f.anchorCustomer.setValue(result);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);

      }
    }, (reason) => {
      console.log('reason is' + reason);
    });
  }


  openRMDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
  //  this.modalOption.windowClass = 'my-class'
    this.modalOption.size='lg';
    const modalRef = this.modalService.open(RmDoComponent, this.modalOption);
    modalRef.result.then((result) => {
      if (result) {
        console.log("row result is " + result)
        this.f.rmId.setValue(result.rmId);
        this.f.rm.setValue(result);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);

      }
    }, (reason) => {
      console.log('reason is' + reason);
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

  //
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: Element) => this.selection.select(row));
  }
  public getCustomerList() {
    console.log('Get Customers')
    console.log()
    const sb = this.customerService.getCustomers().subscribe((res) => {


      for (let i = 0; i < res.length; i++) {
        console.log(res[i].Customer)
        const cust = this.fb.group({
          Customer: [res[i].Customer, '']
        });
        this.counterParties.push(cust)
      }
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    console.log("Form is " + this.form)
    this.subscriptions.push(sb);
  }

  openCustomerDelete(element: any) {
    const index = this.dataSource.data.indexOf(element.id);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.counterParties.clear()
    const res = this.dataSource.data
    for (let i = 0; i < res.length; i++) {
      console.log(res[i].invoiceNumber)
      const cust = this.fb.group({
        Customer: [res[i].Customer, '']
      });
      this.counterParties.push(cust)
    }
    console.log(this.form)
  }

  openCounterPrtyDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(CustomerDOComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      const idx: number = this.dataSource.data.findIndex((obj: { customerId: any; }) => obj.customerId === result.customerId);
      console.log('idx----------------->' + idx)
      if (idx === -1) {
        this.dataSource.data.push(result);
        const cust = this.fb.group({
          customerId: [result.customerId, '']
        });
        this.counterParties.push(cust)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCounterPrtyDelete(element: any) {
    const index = this.dataSource.data.indexOf(element.customerId);
    const idx: number = this.dataSource.data.findIndex((obj: { customerId: any; }) => obj.customerId === element.customerId);
    this.dataSource.data.splice(idx, 1);
    this.dataSource._updateChangeSubscription();
    this.counterParties.clear()
    const res = this.dataSource.data
    for (let i = 0; i < res.length; i++) {
      console.log(res[i].customerId)
      const cust = this.fb.group({
        customerId: [res[i].customerId, '']
      });
      this.counterParties.push(cust)
    }
  }


  /*exportpdf = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [40, 2],
    });

    doc.text('<div><h1 align=\'middle\'> THIS IS TEST ADVICE </h1> <br><h3 align=\'right\'>09/01/2022</h3><h3 align=\'left\'>Buyer1,<br>Trishanu Consulting,<br>SP Road,<br>Mumbai<h3><DIV id=\"id1_2\"><DIV id=\"id1_2_1\"><P class=\"p2 ft7\">OUR BILL REF OUR REF ISSUING BANK\' ISSUING BANK\'S REF APPLICANT</P><P class=\"p3 ft8\">L/C AMOUNT</P><P class=\"p4 ft8\">BILL AMOUNT</P><P class=\"p4 ft8\">TENOR</P></DIV><DIV id=\"id1_2_2\"><P class=\"p5 ft11\"><SPAN class=\"ft9\">:</SPAN><NOBR><SPAN class=\"ft10\">EPDAE-1819000045</SPAN></NOBR><SPAN class=\"ft0\"> </SPAN>(PLEASE QUOTE OUR REFERENCE ON ALL CORRESPONDENCE)</P><P class=\"p4 ft0\"><SPAN class=\"ft9\">:</SPAN><NOBR><SPAN class=\"ft10\">ELC55-181041</SPAN></NOBR></P><P class=\"p4 ft0\"><SPAN class=\"ft9\">:</SPAN><SPAN class=\"ft10\">UNITED ARAB </SPAN><NOBR>BANK-SHARJAH</NOBR></P><P class=\"p4 ft0\"><SPAN class=\"ft9\">:</SPAN><SPAN class=\"ft10\">ILC1011/18/66789</SPAN></P><P class=\"p6 ft0\"><SPAN class=\"ft9\">:</SPAN><SPAN class=\"ft10\">PIVOT ENGINEERING AND GENERAL</SPAN></P><P class=\"p4 ft0\"><SPAN class=\"ft9\">:</SPAN><SPAN class=\"ft10\">AED 1,529,264.10</SPAN></P><P class=\"p4 ft0\"><SPAN class=\"ft9\">:</SPAN><SPAN class=\"ft10\">AED 100.00</SPAN></P><P class=\"p4 ft0\"><SPAN class=\"ft9\">:</SPAN><SPAN class=\"ft10\">105 DAYS FROM DATE OF DELIVERY OF</SPAN></P><P class=\"p7 ft0\">GOODS</P></DIV></DIV><DIV id=\"id1_3\"><P class=\"p8 ft0\">We refer to your letter dated <NOBR>2018-08-07</NOBR> and advise that as per your instructions & without any risk / responsiblity on our part we have forwarded the above documents to issuing bank/nominated bank for thier acceptance / payment on due date.</P><P class=\"p9 ft0\">We shall advise you further upon hearing from them.</P><P class=\"p10 ft8\">FOR ABU DHABI ISLAMIC BANK</P><P class=\"p11 ft8\">TRADE FINANCE DEPARTMENT , ABU DHABI</P><P class=\"p12 ft1\">Subject to the UCP for Documentary Credits (2007 Rev.) ICC Publication No.600</P></DIV></div>', 1, 1);
    doc.save('TestAdvice.pdf');
  };*/


  generarPDF() {
    this.isPrintable=true;
    //const div = document.getElementById('capture');
    const data = this.capture.nativeElement;
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(data).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [40, 2],
      });

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'png', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      this.isPrintable=false;
      return doc;
    }).then((doc) => {
      doc.save('postres.pdf');
    });
  }
  openAdvicePdf( mode: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
  //  this.modalOption.windowClass = 'my-class'
    this.modalOption.size='lg';
    const modalRef = this.modalService.open(CreditAdviseComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
  //  modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

}
