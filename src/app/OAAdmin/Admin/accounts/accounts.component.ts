import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Corporateadmin} from "../../Model/corporateadmin";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {NotificationService} from "../../shared/notification.service";
import {invoiceService} from "../../shared/OAPF/invoice.service";
import {oaadminService} from "../../shared/OAAdmin/oaadmin.service";
import {DatePipe} from "@angular/common";
import {InvoicemodalComponent} from "../../OAPF/invoice/invoicemodal/invoicemodal.component";
import {catchError, retry} from "rxjs/operators";
import Swal from "sweetalert2";
import {AccountmodalComponent} from "./accountmodal/accountmodal.component";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Corporateadmin>();
  displayedColumns: string[] = ['accountId', 'name', 'type', 'currency', 'actions'];
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

  private subscriptions: Subscription[] = [];
  formdata: FormGroup

  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              public invoiceServices: invoiceService,
              public oaadminService: oaadminService) {
  }

  ngOnInit(): void {
    //this.getAccounts();
    this.formdata = new FormGroup({
      filterBy: new FormControl("", [Validators.required]),
      filterValue: new FormControl("", [Validators.required])
    });
    this.getFilterValue();
  }

  public getAccounts() {
    console.log('Get Invoices')
    const sb = this.oaadminService.getAccounts('', '', 'all').subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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

  newAccounts() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(AccountmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is ' + result);
    }, (reason) => {
      //this.getAccounts();
      this.getFilterValue();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAccountDialog(element: any, mode: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(AccountmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      // this.getAccounts();
      this.getFilterValue();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAccountDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
      }
    }, (reason) => {
      //this.getAccounts();
      this.getFilterValue();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.oaadminService.dataItem(data, 'delete').subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error, 'Delete Customer')
      console.error('There was an error!', error);
      return;
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
        //this.getAccounts();
        this.getFilterValue();
      }
    }, (reason) => {
      //this.getAccounts();
      this.getFilterValue();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //Upload Invoices Events
  selectedFiles: any
  progress: any;
  currentFile: File;
  message: any;
  fileInfos: any;
  filterBy: any;
  filterValue: any;

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    console.log(this.progress)
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        this.invoiceServices.upload(this.currentFile).subscribe(
          (event: any) => {
            console.log(event)
            if (event !== null && event !== '') {
              Swal.fire({
                title: 'Invoices uploaded successfully',
                icon: 'success'
              }).then((result) => {
                if (result.value) {
                  this.modalService.dismissAll();
                  //this.getAccounts();
                  this.getFilterValue();
                }
              });
            } else {
              Swal.fire({
                title: 'Error is occurred.',
                icon: 'error'
              });
            }
          },
          (err: any) => {
            console.log(err);
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            //this.currentFile = undefined;
          });
      }
      this.selectedFiles = undefined;
    }
  }

  openFilter(content: any) {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        console.log(result)
      }
    }, (reason) => {
      this.getFilterValue();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getFilterValue() {
    if (this.formdata.valid) {
      const sb = this.oaadminService.getAccounts(this.formdata, '', 'filter').subscribe((res) => {
        this.dataSource.data = res;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
      });
      this.subscriptions.push(sb);
    } else {
      const sb = this.oaadminService.getAccounts(this.formdata, '', 'all').subscribe((res) => {
        this.dataSource.data = res;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
      });
      this.subscriptions.push(sb);
    }
  }

  reset() {
    this.formdata.reset();
    this.getFilterValue();
  }
}
