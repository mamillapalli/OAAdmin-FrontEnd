import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {financingService} from "../../shared/OAPF/financing.service";
import {Subscription} from "rxjs";
import {financing, inits} from "../../Model/OAPF/Request/financing";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FinancingmodalComponent} from "./financingmodal/financingmodal.component";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-financing',
  templateUrl: './financing.component.html',
  styleUrls: ['./financing.component.scss']
})
export class FinancingComponent implements OnInit {
  isLoading: any;
  dataSource: any = new MatTableDataSource<financing>();
  displayedColumns: string[] = ['financeId', 'sbrReferenceId', 'agreementId', 'financeCurrency', 'financeAmount', 'financeDueDate', 'businessType',
    'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  subscriptions: Subscription[] = [];
  financing: financing;
  modalOption: NgbModalOptions = {};
  closeResult: string;

  constructor(public financingService: financingService, public modalService: NgbModal, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getFinancing();
  }

  public getFinancing() {
    console.log('Get Invoices')
    this.spinner.show();
    const sb = this.financingService.getFinancing('', '', 'all').subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.spinner.hide();
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions.push(sb);
  }

  newFinance() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(FinancingmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is ' + result);
    }, (reason) => {
      this.getFinancing();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openFinanceDialog(element: any, mode: string) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(FinancingmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getFinancing();
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
      this.getFinancing();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.financingService.dataItem(data, 'delete').subscribe(res => {
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
