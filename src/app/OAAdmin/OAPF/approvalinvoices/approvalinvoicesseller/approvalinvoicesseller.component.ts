import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
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

@Component({
  selector: 'app-approvalinvoicesseller',
  templateUrl: './approvalinvoicesseller.component.html',
  styleUrls: ['./approvalinvoicesseller.component.scss']
})
export class ApprovalinvoicessellerComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Invoice>();
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
  private API_USERS_URL: string;


  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              public invoiceServices: invoiceService,
              private datePipe: DatePipe,
              private spinner: NgxSpinnerService,
              private oapfcommonService:oapfcommonService) {
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  public getInvoices() {
    console.log('Get Approval Invoices')
    this.spinner.show();
    const sb = this.oapfcommonService.getMethod('invoices/forCounterPartyApproval', null, 'all').subscribe((res:any) => {
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

  private getDismissReason(reason: any) {

  }

}
