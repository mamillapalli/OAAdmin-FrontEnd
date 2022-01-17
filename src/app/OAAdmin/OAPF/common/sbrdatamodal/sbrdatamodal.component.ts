import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-sbrmodal',
  templateUrl: './sbrdatamodal.component.html',
  styleUrls: ['./sbrdatamodal.component.scss']
})
export class SbrdatamodalComponent implements OnInit {
  public displayedColumns: string[] = ['sbrId','anchorCustomer','counterParty','agreement'];
  dataSource: any = new MatTableDataSource<corporateUser>();
  sbrId: any

  //sort
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  constructor(public activeModal: NgbActiveModal,public invoiceServices: invoiceService) { }

  ngOnInit(): void {
    console.log('SBR Modal')
    this.getSBRList();
  }

  getSBRList() {
    this.invoiceServices.loadSBR().subscribe((res) => {
      //this.dataSource.data = res.content;
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
  pageChanged(event: any) {
    console.log(this.sort)
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getSBRList();
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active+','+event.direction
    this.getSBRList();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

}
