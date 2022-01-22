import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { Agreement } from '../../Model/agreement';
import {CommonService} from "../../shared/common.service"

@Component({
  selector: 'app-agreement-do',
  templateUrl: './agreement-do.component.html',
  styleUrls: ['./agreement-do.component.scss']
})
export class AgreementDoComponent implements OnInit {

  public displayedColumns: string[] = ['contractReferenceNumber','contractDocumentNumber','validDate','expiryDate'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<Agreement>();

  constructor(public activeModal: NgbActiveModal,public commonService: CommonService) { }

  ngOnInit(): void {
    console.log('Agreement Modal')
    this.getAgreementList();
  }

  getAgreementList() {
    this.commonService.getAgreements().subscribe((res) => {
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
