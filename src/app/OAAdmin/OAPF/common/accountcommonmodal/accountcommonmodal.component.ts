import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {oaCommonService} from "../../../shared/oacommon.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-accountmodal',
  templateUrl: './accountcommonmodal.component.html',
  styleUrls: ['./accountcommonmodal.component.scss']
})
export class AccountcommonmodalComponent implements OnInit {
  public displayedColumns: string[] = ['accountId','name','type','currency'];
  dataSource: any = new MatTableDataSource<corporateUser>();
  @Input('accountParam') accountParam: any

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
    this.getAccountsList();
  }

  getAccountsList() {
    console.log(this.accountParam)
    const sb = this.oaCommonService.getDataWithPaginationWithMaster('/oaadmin/api/v1/accounts/', this.currentPage, this.pageSize,this.sortData).subscribe((res) => {
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

  pageChanged(event: any) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAccountsList();
  }

  sortChanges(event: Sort) {
    this.sortData = event.active+','+event.direction
    this.getAccountsList();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }
}
