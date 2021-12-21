import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Payment} from "../../Model/OAPF/Request/payment";
import {paymentService} from "../../shared/OAPF/payment.service";
import {FinancingmodalComponent} from "../financing/financingmodal/financingmodal.component";
import {SettlementmodalComponent} from "./settlementmodal/settlementmodal.component";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from 'moment';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Payment>();
  displayedColumns: string[] = ['paymentId', 'financeId', 'sbrReferenceId', 'paymentCurrency', 'paymentAmount', 'valueDate', 'businessType',
    'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  subscriptions: Subscription[] = [];
  Payment: Payment;
  modalOption: NgbModalOptions = {};
  closeResult: string;

  constructor(public paymentService: paymentService,
              public modalService: NgbModal,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getPayments();
  }

  public getPayments() {
    this.spinner.show();
    const sb = this.paymentService.getPayments('', '', 'all').subscribe((res) => {
      //var revertedJsonData = JSON.parse(res, this.parseIsoDateStrToDate);
      //console.log(revertedJsonData)
      //this.covertISOFieldstoDateObjects(res);
      //console.log(res)
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.spinner.hide();
    });
    this.subscriptions.push(sb);
  }




  newSettlement() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(SettlementmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
    }, (reason) => {
      this.getPayments();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openFinanceDialog(element: any, mode: string) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(SettlementmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
    }, (reason) => {
      this.getPayments();
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
      this.getPayments();
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

}
