import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {oaCommonService} from "../../../shared/oacommon.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-reterivecustomersmodal',
  templateUrl: './reterivecustomersmodal.component.html',
  styleUrls: ['./reterivecustomersmodal.component.scss']
})
export class ReterivecustomersmodalComponent implements OnInit {

  public displayedColumns: string[] = ['customerId','name','emailAddress','transactionStatus'];
  dataSource: any = new MatTableDataSource<corporateUser>();
  //sort
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  constructor(public activeModal: NgbActiveModal,public oaCommonService: oaCommonService) { }

  ngOnInit(): void {
    this.getCustomerList();
  }

  getCustomerList() {
    this.oaCommonService.getMethod('oaadmin/api/v1/customers','MASTER').subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
  }

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  passRow(row: any) {
    this.activeModal.close(row);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  pageChanged(event: any) {
    console.log(this.sort)
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getCustomerList();
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active+','+event.direction
    this.getCustomerList();
  }

}
