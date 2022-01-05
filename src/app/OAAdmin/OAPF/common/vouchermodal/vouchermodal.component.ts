import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NotificationService } from "../../../shared/notification.service";
import { MatTableDataSource } from "@angular/material/table";
import { voucher } from "../../../Model/OAPF/Request/voucher";
import { financingService } from "../../../shared/OAPF/financing.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-vouchermodal',
  templateUrl: './vouchermodal.component.html',
  styleUrls: ['./vouchermodal.component.scss']
})
export class VouchermodalComponent implements OnInit,OnDestroy {

  @Input('voucherData') voucherData: any
  dataHeader: any
  dataSource: any = new MatTableDataSource<voucher>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  subscriptions: Subscription[] = [];
  public displayedColumns: string[] = ['accountNumber','accountCurrency','amount','accountDescription','debitCreditFlag','exchangeRate'];


  constructor(public activeModal: NgbActiveModal,
              public NotificationService: NotificationService,
              public financingService: financingService) { }

  ngOnInit(): void {
    this.dataHeader = []
    this.dataSource = new MatTableDataSource<voucher>();
    this.getVoucherEntries()
  }

  getVoucherEntries(){
    console.log('outgoing voucher Data is '+JSON.stringify(this.voucherData))
    const sb = this.financingService.getVoucherEntries(this.voucherData).subscribe((res) => {
      this.dataHeader = [res]
      this.dataSource.data = res.voucherEntries;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  closeModal() {
    this.activeModal.dismiss('closed');
  }
}
