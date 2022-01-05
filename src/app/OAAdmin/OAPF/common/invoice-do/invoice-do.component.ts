import {Component, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-invoice-do',
  templateUrl: './invoice-do.component.html',
  styleUrls: ['./invoice-do.component.scss']
})
export class InvoiceDOComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  private subscriptions: Subscription[] = [];
  @Output('LoanDueDate') LoanDueDate: any
  displayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency', 'amount', 'dueDate', 'status'];

  constructor(public invoiceServices: invoiceService) { }

  ngOnInit(): void {
    this.getInvoices();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  public getInvoices() {
    console.log('Get Invoices')
    const sb = this.invoiceServices.getInvoice(this.LoanDueDate, '', 'loanDueDate').subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions.push(sb);
  }

}
