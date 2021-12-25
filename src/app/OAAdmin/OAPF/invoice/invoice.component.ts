import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Corporateadmin} from "../../Model/corporateadmin";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {NotificationService} from "../../shared/notification.service";
import {CustomerService} from "../../shared/customer.service";
import {DatePipe} from "@angular/common";
import {RmmodalComponent} from "../../Admin/rm/rmmodal/rmmodal.component";
import {catchError, retry} from "rxjs/operators";
import {Observable, Subscription, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {invoiceService} from "../../shared/OAPF/invoice.service";
import {InvoicemodalComponent} from "./invoicemodal/invoicemodal.component";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {FilterComponent} from "../common/filter/filter.component";

const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {

  dataSource: any = new MatTableDataSource<Corporateadmin>();
  displayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status',
    'actions'];
  authToken: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  colorCode: string;
  isLoading: any;
  public time: string | null;


  customFilters = [];
  addFilterFlag = false;
  selectedCustomColumn: any
  firstName = new FormControl('');
  filterValues = {
    firstName: ''
  };

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  errorMsg = '';

  private subscriptions: Subscription[] = [];
  isLoading$: any;


  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              public invoiceServices: invoiceService,
              private datePipe: DatePipe,private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  public getInvoices() {
    console.log('Get Invoices')
    this.spinner.show();
    const sb = this.invoiceServices.getInvoice('', '', 'all').subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading$ =false;
      this.spinner.hide();
      this.dataSource.filterPredicate = this.createFilter();
    });
    this.subscriptions.push(sb);
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data: { firstName: string; }, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.firstName.toLowerCase().indexOf(searchTerms.firstName) !== -1
    }
    return filterFunction;
  }

  newInvoices() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(InvoicemodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is ' + result);
    }, (reason) => {
      this.getInvoices();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openInvoiceDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(InvoicemodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getInvoices();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openInvoiceDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
      }
    }, (reason) => {
      this.getInvoices();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.invoiceServices.dataItem(data, 'delete').subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error, 'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteInvoice(userId: any) {
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
      if (post.deleteFlag) {
        this.colorCode = '#cc0248'
      } else if (post.transactionStatus === 'MASTER') {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


  uploadInvoice(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.getInvoices();
      }
    }, (reason) => {
      this.getInvoices();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.errorMsg = '';
    this.message = '';
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.invoiceServices.upload(this.currentFile).subscribe(
          (event: any) => {
            console.log(event)
            this.progress = Math.round(100 * 100  / 100);
            if(event.fileId != null)
            {
              this.invoiceServices.uploadFileStatus(event.fileId).subscribe((res: any) => {
                console.log(res)
                if (res !== null) {
                  let status = res
                  Swal.fire({
                    title: 'File Status is '+res.fileStatus,
                    icon: 'success'
                  });
                } else {
                  Swal.fire({
                    title: 'Error is occurred.'+res,
                    icon: 'error'
                  });
                }
              }, (error: { message: any }) => {
                console.error('There was an error!', error);
                Swal.fire({
                  title: 'Error is occurred.'+error,
                  icon: 'error'
                });
                return;
              });
            }
          },
          (err: any) => {
            console.log(err);
            if (err.error && err.error.responseMessage) {
              this.errorMsg = err.error.responseMessage;
            } else {
              this.errorMsg = 'Error occurred while uploading a file!';
            }
            console.error('There was an error!', this.errorMsg);
            Swal.fire({
              title: 'Error is occurred.'+this.errorMsg,
              icon: 'error'
            });
            this.currentFile = undefined;
          });
      }

      this.selectedFiles = undefined;
    }
  }

  openFilter() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalService.open(FilterComponent, this.modalOption).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result) {
        console.log("row result is "+result)
        console.log('test'+result.value)
        // if (this.productForm.valid && this.productForm.value.quantities.length > 0) {
        //   const sb = this.oaadminService.getAccounts(this.productForm, '', 'filter').subscribe((res) => {
        //     this.dataSource.data = res;
        //     this.dataSource.sort = this.sort;
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.filterPredicate = this.createFilter();
        //   });
        //   this.subscriptions.push(sb);
        // } else {
        //   const sb = this.oaadminService.getAccounts(this.productForm, '', 'all').subscribe((res) => {
        //     this.dataSource.data = res;
        //     this.dataSource.sort = this.sort;
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.filterPredicate = this.createFilter();
        //   });
        //   this.subscriptions.push(sb);
        // }
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
