import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {Subscription} from "rxjs";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-invoicehistroy',
  templateUrl: './invoicehistroy.component.html',
  styleUrls: ['./invoicehistroy.component.scss']
})
export class InvoicehistroyComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  private subscriptions: Subscription[] = [];
  @Output('invoiceNumber') invoiceNumber: any;
  displayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'agreementId', 'currency',
    'amount', 'dueDate', 'status', 'eventName','eventUser','eventDate'];

  constructor(public invoiceServices: invoiceService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.getInvoices();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  public getInvoices() {
    const sb = this.invoiceServices.getInvoice('', this.invoiceNumber, 'viewHistory').subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions.push(sb);
  }

  closeModal(cancel: string) {
    this.activeModal.dismiss(cancel);
  }
}
