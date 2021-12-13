import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription, throwError} from "rxjs";
import {Corporateadmin} from "../../../../../Model/corporateadmin";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, retry} from "rxjs/operators";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../../../modules/auth";
import {environment} from "../../../../../../../environments/environment";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Customer} from "../../../../../Model/customer";
import { coporateadminreq } from 'src/app/OAAdmin/Model/coporateadminreq';
import {MatTableDataSource} from "@angular/material/table";
const API_USERS_URL = `${environment.apiUrl}`;
@Component({
  selector: 'app-corporateadminstep1',
  templateUrl: './corporateadminstep1.component.html',
  styleUrls: ['./corporateadminstep1.component.scss']
})
export class Corporateadminstep1Component implements OnInit {
  coporateadminreq: coporateadminreq;

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Corporateadmin>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Corporateadmin>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  private closeResult: string;
  private content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<Corporateadmin>();
  public displayedColumns: string[] = ['customerId', 'name', 'emailAddress','status','transactionStatus'];
  clickedRows = new Set<Customer>();

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,private authService: AuthService) {}

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
      userId: [this.defaultValues.userId,[Validators.required]],
      firstName: [this.defaultValues.firstName,[Validators.required]],
      lastName: [this.defaultValues.lastName,[Validators.required]],
      emailAddress: [this.defaultValues.emailAddress,[Validators.required, Validators.email]],
      customers: [this.defaultValues.customers]
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('userId')?.hasError('required') ||
      this.form.get('firstName')?.hasError('required') ||
      this.form.get('lastName')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('email')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.userId.setValue(this.formValue.userId);
    this.f.firstName.setValue(this.formValue.firstName);
    this.f.lastName.setValue(this.formValue.lastName);
    this.f.emailAddress.setValue(this.formValue.emailAddress);
    console.log(this.formValue.customers[0].customerId)
    this.f.customers.setValue(this.formValue.customers[0].customerId);
  }

  // private loadCustomerList() {
  //   this.authToken = this.authService.getAuthFromLocalStorage();
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: `Bearer ${this.authToken?.jwt}`,
  //   });
  //
  //   return this.http.get(API_USERS_URL + '/api/v1/customers', {
  //     headers: httpHeaders,
  //   }).pipe(
  //     retry(1)
  //   );
  // }

  loadEmployees() {
    return this.loadCustomerList().subscribe((data: {}) => {
      console.log("data is :"+data)
      this.dataSource.data = data;
      console.log(this.dataSource.data)
    })
  }

  loadCustomerList(): Observable<Customer> {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get<Customer>(API_USERS_URL + '/api/v1/customers',{headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  handleError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  get f() {
    return this.form.controls;
  }

  closeModel() {
    this.myModal.nativeElement.className = 'modal hide';
  }

  openModel() {
    this.myModal.nativeElement.className = 'modal fade show';
  }

  openCustomers() {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteModal() {
    this.deleteSuperAdmin().subscribe(res => {
    }, (error: { message: any }) => {
      console.error('There was an error!', error);
      return;
    });
  }

  deleteSuperAdmin() {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/superadmins/delete/' , {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
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

  errorHandle(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
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


  openCustomerDialog(content: any) {
    this.loadEmployees();
    console.log("openCustomerDialog");
    console.log(this.dataSource.data)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    this.modalService.open(content, this.modalOption).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result) {
          console.log("row result is "+result.customerId)
        this.f.customers.setValue(result.customerId);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  selectedCustomer(aaa: any) {
      console.log(aaa);
  }
}
