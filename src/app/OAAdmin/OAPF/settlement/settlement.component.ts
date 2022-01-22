import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Payment} from "../../Model/OAPF/Request/payment";
import {paymentService} from "../../shared/OAPF/payment.service";
import {FinancingmodalComponent} from "../financing/financingmodal/financingmodal.component";
import {SettlementmodalComponent} from "./settlementmodal/settlementmodal.component";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from 'moment';
import {oapfcommonService} from "../../shared/oapfcommon.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {FilterComponent} from "../common/filter/filter.component";
import {AuthService} from "../../../modules/auth";

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Payment>();
  @Output() displayedColumns: string[] = ['paymentId', 'financeId', 'sbrReferenceId', 'paymentCurrency', 'paymentAmount', 'valueDate', 'businessType',
    'transactionStatus','actions'];
  @Output() fDisplayedColumns: string[] = ['paymentId', 'financeId', 'sbrReferenceId', 'paymentCurrency', 'paymentAmount', 'valueDate', 'businessType',
    'transactionStatus'];
  subscriptions: Subscription[] = [];
  Payment: Payment;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  authRoles: any

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  constructor(public paymentService: paymentService,
              public modalService: NgbModal,
              private spinner: NgxSpinnerService,
              public oapfCommonService: oapfcommonService,
              public authService: AuthService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.getPayments(this.currentPage,this.pageSize,this.sortData);
  }

  public getPayments(currentPage: number, pageSize: number, sortData: any) {
    const sb = this.oapfCommonService.getDataWithPagination('/oapf/api/v1/payments/', this.currentPage, this.pageSize,this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }




  newSettlement() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(SettlementmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
    }, (reason) => {
      this.getPayments(this.currentPage,this.pageSize,this.sortData);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openFinanceDialog(element: any, mode: string) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(SettlementmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
    }, (reason) => {
      this.getPayments(this.currentPage,this.pageSize,this.sortData);
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
      this.getPayments(this.currentPage,this.pageSize,this.sortData);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.paymentService.dataItem(data, 'delete').subscribe(res => {
    }, (error: { message: any }) => {
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

  pageChanged(event: any) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPayments(this.currentPage,this.pageSize,this.sortData);
  }

  sortChanges(event: Sort) {
    this.sortData = event.active+','+event.direction
    this.getPayments(this.currentPage,this.pageSize,this.sortData);
  }

  openFilter() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oapfCommonService.getFilterWithPagination(result, 'filter', 'oapf/api/v1/payments',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oapfCommonService.getFilterWithPagination(result, 'all', 'oapf/api/v1/payments',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }
}
