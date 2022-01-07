import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {NotificationService} from "../../shared/notification.service";
import {DatePipe} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import {Subscription, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {invoiceService} from "../../shared/OAPF/invoice.service";
import {InvoicemodalComponent} from "./invoicemodal/invoicemodal.component";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {FilterComponent} from "../common/filter/filter.component";
import {oapfcommonService} from "../../shared/oapfcommon.service";
import {InvoicehistroyComponent} from "../common/invoicehistroy/invoicehistroy.component";
import {Invoice} from "../../Model/OAPF/Request/invoice";

const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {

  dataSource: any = new MatTableDataSource<Invoice>();
  displayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status',
    'actions'];
  fDisplayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status']
    authToken: any;

  modalOption: NgbModalOptions = {};
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
  authRoles : any


  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              public invoiceServices: invoiceService,
              private datePipe: DatePipe,
              private spinner: NgxSpinnerService,
              public oapfcommonService: oapfcommonService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.getInvoices(this.currentPage, this.pageSize, this.sortData);
  }

  public getInvoices(currentPage: number, pageSize: number, sortData: any) {

    console.log('Get Invoices')
    this.spinner.show();
    const sb = this.oapfcommonService.getDataWithPagination('/oapf/api/v1/invoices/', this.currentPage, this.pageSize,this.sortData).subscribe((res) => {
      console.log(res)
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
      console.log(this.totalRows)
      // this.dataSource.pageSize = res.totalPages
      // this.dataSource.sort = this.sort;
      // this.dataSource.pageSize = res.totalPages
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
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
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(InvoicemodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is ' + result);
    }, (reason) => {
      this.getInvoices(this.currentPage, this.pageSize, this.sortData);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openInvoiceDialog(element: any, mode: any) {
    if(mode === 'viewHistory')
    {
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      //this.modalOption.windowClass = 'my-class'
      this.modalOption.size = 'xl';
      const modalRef = this.modalService.open(InvoicehistroyComponent, this.modalOption);
      modalRef.componentInstance.invoiceNumber = element.invoiceNumber;
      modalRef.result.then((result) => {
        console.log(result);
      }, (reason) => {
        this.getInvoices(this.currentPage, this.pageSize, this.sortData);
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      //this.modalOption.windowClass = 'my-class'
      this.modalOption.size = 'xl';
      const modalRef = this.modalService.open(InvoicemodalComponent, this.modalOption);
      modalRef.componentInstance.mode = mode;
      modalRef.componentInstance.fromParent = element;
      modalRef.result.then((result) => {
        console.log(result);
      }, (reason) => {
        this.getInvoices(this.currentPage, this.pageSize, this.sortData);
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  openInvoiceDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
      }
    }, (reason) => {
      this.getInvoices(this.currentPage, this.pageSize, this.sortData);
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
        this.getInvoices(this.currentPage, this.pageSize, this.sortData);
      }
    }, (reason) => {
      this.getInvoices(this.currentPage, this.pageSize, this.sortData);
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
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'filter', 'oapf/api/v1/invoices',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'all', 'oapf/api/v1/invoices',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  pageChanged(event: any) {
    console.log(this.sort)
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInvoices(this.currentPage,this.pageSize,this.sortData);
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active+','+event.direction
    this.getInvoices(this.currentPage,this.pageSize,event.active);
  }

}
