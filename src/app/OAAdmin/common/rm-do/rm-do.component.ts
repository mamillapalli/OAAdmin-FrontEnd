import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import { rm } from '../../Model/OAAdmin/Request/rm';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { CustomerService } from '../../shared/customer.service';

@Component({
  selector: 'app-rm-do',
  templateUrl: './rm-do.component.html',
  styleUrls: ['./rm-do.component.scss']
})
export class RmDoComponent implements OnInit {
  public displayedColumns: string[] = ['rmId','firstName'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<rm>();

  constructor(public activeModal: NgbActiveModal,public customerService: CustomerService) { }

  ngOnInit(): void {
    console.log('RM Modal')
    this.getRMList();
  }

  getRMList() {
    this.customerService.getAllRMS().subscribe((res) => {
      this.dataSource.data = res.content;
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

