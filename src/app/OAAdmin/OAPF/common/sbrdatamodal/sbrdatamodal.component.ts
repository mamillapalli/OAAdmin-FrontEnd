import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {invoiceService} from "../../../shared/OAPF/invoice.service";

@Component({
  selector: 'app-sbrmodal',
  templateUrl: './sbrdatamodal.component.html',
  styleUrls: ['./sbrdatamodal.component.scss']
})
export class SbrdatamodalComponent implements OnInit {
  public displayedColumns: string[] = ['sbrId','anchorCustomer','counterParty','agreement'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  sbrId: any

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
