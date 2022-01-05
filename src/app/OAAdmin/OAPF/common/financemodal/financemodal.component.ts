import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {financing} from "../../../Model/OAPF/Request/financing";
import {financingService} from "../../../shared/OAPF/financing.service";

@Component({
  selector: 'app-financemodal',
  templateUrl: './financemodal.component.html',
  styleUrls: ['./financemodal.component.scss']
})
export class FinancemodalComponent implements OnInit {

  public displayedColumns: string[] = ['financeId','sbrReferenceId','agreementId'
    ,'buyerId','sellerId','financeCurrency','financeAmount'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<financing>();

  constructor(public activeModal: NgbActiveModal,public financingService: financingService) { }

  ngOnInit(): void {
    this.getFinanceList();
  }

  getFinanceList() {
    const sb = this.financingService.getFinancing('', '', 'financeModal').subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  passRow(row: any) {
    this.activeModal.close(row);
  }

}
