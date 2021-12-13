import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Subscription, throwError} from 'rxjs';
import {ICreateAccount} from "../../../../../../modules/wizards/create-account.helper";
import {MatTableDataSource} from "@angular/material/table";
import {Corporateadmin} from "../../../../../Model/corporateadmin";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../../../../modules/auth";
import {NotificationService} from "../../../../../shared/notification.service";
import {CustomerService} from "../../../../../shared/customer.service";
import {DatePipe} from "@angular/common";
import {TestmodalComponent} from "../../testmodal.component";
import {catchError, retry} from "rxjs/operators";
import {environment} from "../../../../../../../environments/environment";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<ICreateAccount>;
  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder,public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService : NotificationService,
              public customerService: CustomerService,
              private datePipe: DatePipe) {}

  ngOnInit() {
    this.time = this.datePipe.transform(new Date());
    this.getCorporateuser();
    this.initForm();
    this.updateParentModel({}, true);
  }

  initForm() {
    this.form = this.fb.group({
      accountType: [this.defaultValues.accountType, [Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, true);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  dataSource: any = new MatTableDataSource<Corporateadmin>();
  displayedColumns: string[] = ['rmId', 'name', 'emailAddress', 'joiningDate', 'expiryDate',  'status', 'actions'];
  authToken: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  colorCode:string;
  isLoading: any;
  public time: string | null;


  customFilters = [];
  addFilterFlag = false;
  selectedCustomColumn:any




  public getCorporateuser() {
    this.isLoading = true;
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get(API_USERS_URL + '/api/v1/rms', {
      headers: httpHeaders,
    }).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data:{name: string}, filterValue: string) =>
        data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
    });
  }

  newRM() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(TestmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is '+result);
    }, (reason) => {
      this.getCorporateuser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRMDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(TestmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getCorporateuser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRMDelete(content:any, element: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element.customerId);
      }
    }, (reason) => {
      this.getCorporateuser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(customerId:any) {
    this.deleteCorporates(customerId).subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error,'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteCorporates(userId: any) {
    console.log(userId)
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(API_USERS_URL + '/api/v1/rms/' + userId, {headers: httpHeaders})
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

  getColor(post: any) {
    {
      if(post.deleteFlag)
      {
        this.colorCode = '#cc0248'
      } else if(post.transactionStatus === 'MASTER') {
        this.colorCode = '#151414'
      } else {

        this.colorCode = '#5db6e3'
      }
      return this.colorCode;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
