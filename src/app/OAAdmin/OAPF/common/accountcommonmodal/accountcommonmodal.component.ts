import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {oaCommonService} from "../../../shared/oacommon.service";

@Component({
  selector: 'app-accountmodal',
  templateUrl: './accountcommonmodal.component.html',
  styleUrls: ['./accountcommonmodal.component.scss']
})
export class AccountcommonmodalComponent implements OnInit {
  public displayedColumns: string[] = ['accountId','name','type','currency'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  @Input('accountParam') accountParam: any

  constructor(public activeModal: NgbActiveModal,public oaCommonService: oaCommonService) { }

  ngOnInit(): void {
    this.getAccountsList();
  }

  getAccountsList() {
    console.log(this.accountParam)
    this.oaCommonService.getMethod('/oaadmin/api/v1/accounts/','master').subscribe((res) => {
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
