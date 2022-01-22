import {Component, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {Subscription} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-invoice-do',
  templateUrl: './invoice-do.component.html',
  styleUrls: ['./invoice-do.component.scss']
})

export class InvoiceDOComponent implements OnInit,OnDestroy {
  dataSource: any = new MatTableDataSource<corporateUser>();
  private subscriptions: Subscription[] = [];
  @Output('LoanDueDate') LoanDueDate: any
  @Output('mode') mode: any
  displayedColumns: any

  //sorting
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  constructor(public invoiceServices: invoiceService,public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    //this.displayedColumns = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status'];
    this.getInvoices();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  public getInvoices() {
    console.log('Get Invoices'+this.LoanDueDate)
    let sb
    if(this.mode === 'copy') {
      sb = this.invoiceServices.getInvoiceWithPagination('oapf/api/v1/invoices/','', '', this.currentPage, this.pageSize, this.sortData, 'copy').subscribe((res) => {
        this.dataSource.data = res.content;
        this.displayedColumns= ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status']
        this.totalRows = res.totalElements
        console.log(this.totalRows)
      });
    } else {
      sb = this.invoiceServices.getInvoiceWithPagination('oapf/api/v1/invoices/', this.LoanDueDate, '', this.currentPage, this.pageSize, this.sortData, 'loanDueDate').subscribe((res) => {
        this.dataSource.data = res.content;
        this.displayedColumns= ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status']
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
