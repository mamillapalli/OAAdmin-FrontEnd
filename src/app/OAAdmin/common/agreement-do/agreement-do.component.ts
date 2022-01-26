import {CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from 'rxjs';
import {Agreement} from '../../Model/agreement';
import {CommonService} from "../../shared/common.service"
import {CONDITIONS_FUNCTIONS} from '../../shared/condition_function';
import {CONDITIONS_LIST} from '../../shared/condition_list';
import {oapfcommonService} from "../../shared/oapfcommon.service";

@Component({
  selector: 'app-agreement-do',
  templateUrl: './agreement-do.component.html',
  styleUrls: ['./agreement-do.component.scss']
})
export class AgreementDoComponent implements OnInit {

  public displayedColumns: string[] = ['contractReferenceNumber', 'contractDocumentNumber', 'validDate', 'expiryDate'];
  dataSource =  new MatTableDataSource<Agreement>();

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData: any
  private subscriptions: Subscription[] = [];

  //inside filter
  public conditionsList = CONDITIONS_LIST;
  public searchValue: any = {};
  public searchLabel: any = {};
  public searchCondition: any = {};
  private _filterMethods = CONDITIONS_FUNCTIONS;
  searchFilter: any = {};
  columns: { columnDef: string; header: string; }[];

  constructor(public activeModal: NgbActiveModal,
              public oapfCommonService: oapfcommonService) {
  }

  ngOnInit(): void {
    this.columns = [
      {columnDef: 'contractReferenceNumber', header: 'Contract Ref No'},
      {columnDef: 'contractDocumentNumber', header: 'Contract Doc No'},
      {columnDef: 'validDate', header: 'Valid Date'},
      {columnDef: 'expiryDate', header: 'Expiry Date'},
    ]
    this.getAgreementList();
  }

  getAgreementList() {
    const sb = this.oapfCommonService.getDataWithPaginationMaster('/oaadmin/api/v1/agreements/', this.currentPage, this.pageSize, this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  passRow(row: any) {
    this.activeModal.close(row);
  }

  pageChanged(event: any) {
    console.log(this.sort)
    console.log({event});
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAgreementList();
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active + ',' + event.direction
    this.getAgreementList();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }


}
