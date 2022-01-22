import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {corporateadmin} from "../../Model/OAAdmin/Request/corporateadmin";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
import {caccounts} from "../../Model/OAAdmin/CRequest/caccounts";
import {bankuser} from "../../Model/OAAdmin/Request/bankuser";
import {NgxSpinnerService} from "ngx-spinner";
import {BankusermodalComponent} from "../bankuser/bankusermodal/bankusermodal.component";
import {FilterComponent} from "../../OAPF/common/filter/filter.component";
import { oaCommonService } from "../../shared/oacommon.service";
import {Accounts} from "../../Model/OAAdmin/Request/accounts";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Accounts>();
  displayedColumns: string[] =  ['accountId', 'name', 'accountType', 'currency', 'debitCreditFlag', 'customerId','businessType','actions'];
  fDisplayedColumns: string[] = ['accountId', 'name', 'accountType', 'currency', 'debitCreditFlag', 'customerId','businessType']
  authToken: any;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  isLoading: any;

  private subscriptions: Subscription[] = [];
  authRoles : any

  //sort
  totalRows = 0;
  pageSize =  5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  constructor(
    public authService: AuthService,
    public modalService: NgbModal,
    public notifyService: NotificationService,
    public oaCommonService: oaCommonService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles

  }


  ngOnInit(): void {
    console.log(this.authRoles.split(','))
    this.authRoles = this.authRoles.split(',')
    this.getAccounts();
  }

  public getAccounts() {
    const sb = this.oaCommonService.getMethodWithPagination('/oaadmin/api/v1/accounts', '', this.currentPage,this.pageSize ,this.sortData  ).subscribe((res) => {
      console.log('response is '+res)
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }


  newAccounts() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(AccountmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newbankadmins is ' + result);
    }, (reason) => {
      this.getAccounts();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  findValueInArray(value: any, arr: string | any[]) {
    let result = false;
    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      console.log(name)
      if (name === value) {
        result = true
        break;
      }
    }
    return result;
  }

  openAccountsDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(AccountmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getAccounts();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openBankUserDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
      }
    }, (reason) => {
      this.getAccounts();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.oaCommonService.dataItem(data, data.userId, 'delete', '/oaadmin/api/v1/accounts/delete/').subscribe(res => {
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
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  openFilter() {
    this.pageSize = 5;
    this.currentPage = 0;
    console.log('open filter')
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    console.log(this.fDisplayedColumns)
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oaCommonService.getFilterWithPagination(result, 'filter', '/oaadmin/api/v1/accounts',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oaCommonService.getFilterWithPagination(result, 'all', '/oaadmin/api/v1/accounts',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
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
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAccounts();
  }

  sortChanges(event: Sort) {
    this.sortData = event.active
    this.getAccounts();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }


}
