import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {oaCommonService} from "../../../shared/oacommon.service";

@Component({
  selector: 'app-reterivecustomersmodal',
  templateUrl: './reterivecustomersmodal.component.html',
  styleUrls: ['./reterivecustomersmodal.component.scss']
})
export class ReterivecustomersmodalComponent implements OnInit {

  public displayedColumns: string[] = ['customerId','name','emailAddress','transactionStatus'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<corporateUser>();

  constructor(public activeModal: NgbActiveModal,public oaCommonService: oaCommonService) { }

  ngOnInit(): void {
    console.log('SBR Modal')
    this.getCustomerList();
  }

  getCustomerList() {
    this.oaCommonService.getMethod('oaadmin/api/v1/customers','MASTER').subscribe((res) => {
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
