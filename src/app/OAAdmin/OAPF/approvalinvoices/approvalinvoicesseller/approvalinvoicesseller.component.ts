import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {Subscription, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../../modules/auth";
import {NotificationService} from "../../../shared/notification.service";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {InvoicemodalComponent} from "../../invoice/invoicemodal/invoicemodal.component";
import {oapfcommonService} from "../../../shared/oapfcommon.service";
import {FilterComponent} from "../../common/filter/filter.component";
import {Invoice} from "../../../Model/OAPF/Request/invoice";
import {SellerApprovalInvoiceModalComponent} from "./seller-approval-invoice-modal/seller-approval-invoice-modal.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-approvalinvoicesseller',
  templateUrl: './approvalinvoicesseller.component.html',
  styleUrls: ['./approvalinvoicesseller.component.scss']
})
export class ApprovalinvoicessellerComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Invoice>();
  displayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status',
    'actions'];
  @Output() fDisplayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status',
    'actions'];
  authToken: any;
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
  private API_USERS_URL: string;

  //soring
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData: any
  authRoles : any

  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              public invoiceServices: invoiceService,
              private datePipe: DatePipe,
              private spinner: NgxSpinnerService,
              private oapfcommonService:oapfcommonService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  public getInvoices() {
    console.log('Get Approval Invoices')
    const sb = this.oapfcommonService.getDataWithPagination('oapf/api/v1/invoices/forCounterPartyApproval', this.currentPage, this.pageSize, this.sortData).subscribe((res:any) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
      console.log(this.totalRows)
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

  openInvoiceDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(SellerApprovalInvoiceModalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getInvoices();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  openFilter() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log(result);
      console.log('test' + result.value.filterOption)
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'filter', 'oapf/api/v1/invoices/forCounterPartyApproval',this.currentPage,this.pageSize,this.sortData).subscribe((res) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'all', 'oapf/api/v1/invoices/forCounterPartyApproval',this.currentPage,this.pageSize,this.sortData).subscribe((res) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any) {

  }

  pageChanged(event: any) {
    console.log(this.sort)
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInvoices();
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active+','+event.direction
    this.getInvoices();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

}
