import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-copy-as-modal',
  templateUrl: './copy-as-modal.component.html',
  styleUrls: ['./copy-as-modal.component.scss']
})
export class CopyAsModalComponent implements OnInit {

  dataSource: any = new MatTableDataSource<corporateUser>();
  private subscriptions: Subscription[] = [];
  @Output('LoanDueDate') LoanDueDate: any
  @Output('mode') mode: any
  @Output('displayedColumns') displayedColumns: any
  @Output('fDisplayedColumns') fDisplayedColumns: any
  @Output('functionType') functionType: any
  @Output('url') url: any

  //sorting
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData: any

  constructor(public invoiceServices: invoiceService, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    console.log(this.displayedColumns)
    console.log(this.functionType)
    //this.displayedColumns = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status'];
    this.getInvoices();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  public getInvoices() {
    console.log('Get Invoices' + this.displayedColumns)
    console.log('Get Invoices' + this.fDisplayedColumns)
    let sb
    if (this.mode === 'copy') {
      if (this.functionType === 'finances') {
        sb = this.invoiceServices.getInvoiceWithPagination('oapf/api/v1/finances/', '', '', this.currentPage, this.pageSize, this.sortData, 'copy').subscribe((res) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
          console.log(this.totalRows)
        });
      } else if (this.functionType === 'rms') {
        sb = this.invoiceServices.getInvoiceWithPagination('oaadmin/api/v1/rms/', '', '', this.currentPage, this.pageSize, this.sortData, 'copy').subscribe((res) => {
          this.displayedColumns = ['rmId', 'firstName', 'lastName', 'emailAddress', 'expiryDate', 'transactionStatus'];
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
          console.log(this.totalRows)
        });
      } else if (this.functionType === 'admin') {
        sb = this.invoiceServices.getInvoiceWithPagination(this.url, '', '', this.currentPage, this.pageSize, this.sortData, 'copy').subscribe((res) => {
          console.log(this.displayedColumns)
          console.log(this.fDisplayedColumns)
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
          console.log(this.totalRows)
        });
      } else if (this.functionType === 'holiday') {
        sb = this.invoiceServices.getInvoiceWithPagination(this.url, '', '', this.currentPage, this.pageSize, this.sortData, 'copy').subscribe((res) => {
          console.log(this.displayedColumns)
          console.log(this.fDisplayedColumns)
          this.dataSource.data = res;
          this.totalRows = res.length
          console.log(this.totalRows)
        });
      } else {
        sb = this.invoiceServices.getInvoiceWithPagination('oapf/api/v1/invoices/', '', '', this.currentPage, this.pageSize, this.sortData, 'copy').subscribe((res) => {
          this.dataSource.data = res.content;
          this.displayedColumns = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status']
          this.totalRows = res.totalElements
          console.log(this.totalRows)
        });
      }
    } else {
      sb = this.invoiceServices.getInvoiceWithPagination('oapf/api/v1/invoices/', this.LoanDueDate, '', this.currentPage, this.pageSize, this.sortData, 'loanDueDate').subscribe((res) => {
        this.dataSource.data = res.content;
        this.displayedColumns = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status']
        this.totalRows = res.totalElements
        console.log(this.totalRows)
      });
    }
    this.subscriptions.push(sb);
  }

  passRow(row: any) {
    this.activeModal.close(row);
  }

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

}
