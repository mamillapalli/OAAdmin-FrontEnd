import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Invoice} from "../../OAAdmin/Model/OAPF/Request/invoice";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../modules/auth";
import {NotificationService} from "../../OAAdmin/shared/notification.service";
import {invoiceService} from "../../OAAdmin/shared/OAPF/invoice.service";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {InvoicemodalComponent} from "../../OAAdmin/OAPF/invoice/invoicemodal/invoicemodal.component";
import {InvoicehistroyComponent} from "../../OAAdmin/OAPF/common/invoicehistroy/invoicehistroy.component";
import Swal from "sweetalert2";
import {FilterComponent} from "../../OAAdmin/OAPF/common/filter/filter.component";
import {oaCommonService} from "../../OAAdmin/shared/oacommon.service";
import {ExChangeRatesModalComponent} from "./ex-change-rates-modal/ex-change-rates-modal.component";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-ex-change-rates',
  templateUrl: './ex-change-rates.component.html',
  styleUrls: ['./ex-change-rates.component.scss']
})
export class ExChangeRatesComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Invoice>();
  displayedColumns: string[] = ['fromCurrency', 'toCurrency', 'rateType', 'rateValue', 'mdFlag','actions'];
  fDisplayedColumns: string[] = ['fromCurrency', 'toCurrency', 'rateType', 'rateValue', 'mdFlag']
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
              public oaCommonService: oaCommonService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.getExchangeRate(this.currentPage, this.pageSize, this.sortData);
  }

  public getExchangeRate(currentPage: number, pageSize: number, sortData: any) {
    console.log('Get Invoices')
    const sb = this.oaCommonService.getMethod('/oadata/api/v1/exchangeRates','All' ).subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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

  newExchangeRate() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(ExChangeRatesModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is ' + result);
    }, (reason) => {
      this.getExchangeRate(this.currentPage, this.pageSize, this.sortData);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openExchangeRateDialog(element: any, mode: any) {
    if(mode === 'viewHistory')
    {
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      //this.modalOption.windowClass = 'my-class'
      const modalRef = this.modalService.open(ExChangeRatesModalComponent, this.modalOption);
      modalRef.componentInstance.invoiceNumber = element.invoiceNumber;
      modalRef.result.then((result) => {
        console.log(result);
      }, (reason) => {
        this.getExchangeRate(this.currentPage, this.pageSize, this.sortData);
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      console.log('123'+element)
      console.log('123'+mode)
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      //this.modalOption.windowClass = 'my-class'
      this.modalOption.size = 'sm';
      const modalRef = this.modalService.open(InvoicemodalComponent, this.modalOption);
      modalRef.componentInstance.mode = mode;
      modalRef.componentInstance.fromParent = element;
      modalRef.result.then((result) => {
        console.log(result);
      }, (reason) => {
        this.getExchangeRate(this.currentPage, this.pageSize, this.sortData);
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
      this.getExchangeRate(this.currentPage, this.pageSize, this.sortData);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  uploadExchangeRate(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.getExchangeRate(this.currentPage, this.pageSize, this.sortData);
        content.clear
      }
    }, (reason) => {
      this.getExchangeRate(this.currentPage, this.pageSize, this.sortData);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      content.clear
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

        this.oaCommonService.upload('/oadata/api/v1/exchangeRates/uploadFile/',this.currentFile).subscribe(
          (event: any) => {
            console.log(event)
            console.log(event.fileId)
            this.progress = Math.round(100 * 100  / 100);
            if(event.fileId != null)
            {
              delay(1000*60)
              this.oaCommonService.uploadFileStatus('/oadata/api/v1/exchangeRates/uploadFileStatus/',event.fileId).subscribe((res: any) => {
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
    }
    this.selectedFiles = undefined;
    this.progress = 0;
  }

  openFilter() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oaCommonService.getFilter(result, 'filter', '/oadata/api/v1/exchangeRates').subscribe((res: any) => {
          this.dataSource.data = res;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oaCommonService.getFilter(result, 'all', 'oadata/api/v1/exchangeRates').subscribe((res: any) => {
          this.dataSource.data = res;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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
    this.getExchangeRate(this.currentPage,this.pageSize,this.sortData);
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active+','+event.direction
    this.getExchangeRate(this.currentPage,this.pageSize,event.active);
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
