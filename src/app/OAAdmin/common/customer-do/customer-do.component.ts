import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Customer} from "../../Model/customer";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { CustomerService } from '../../shared/customer.service';

@Component({
  selector: 'app-customer-do',
  templateUrl: './customer-do.component.html',
  styleUrls: ['./customer-do.component.scss']
})
export class CustomerDOComponent implements OnInit {

  public displayedColumns: string[] = ['customerId','name','addressLine1'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<Customer>();

  constructor(public activeModal: NgbActiveModal,public customerService: CustomerService) { }

  ngOnInit(): void {
    console.log('Customer Modal')
    this.getCustList();
  }

  getCustList() {
    this.customerService.getCustomers().subscribe((res) => {
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
