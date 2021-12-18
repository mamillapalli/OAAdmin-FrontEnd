import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Corporateuser} from "../../../Model/corporateuser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {invoiceService} from "../../../shared/OAPF/invoice.service";

@Component({
  selector: 'app-sbrmodal',
  templateUrl: './sbrmodal.component.html',
  styleUrls: ['./sbrmodal.component.scss']
})
export class SbrmodalComponent implements OnInit {
  public displayedColumns: string[] = ['sbrId','anchorCustomer','counterParty','agreement'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<Corporateuser>();

  constructor(public activeModal: NgbActiveModal,public invoiceServices: invoiceService) { }

  ngOnInit(): void {
    console.log('SBR Modal')
    this.getSBRList();
  }

  getSBRList() {
    this.invoiceServices.loadSBR().subscribe((res) => {
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
