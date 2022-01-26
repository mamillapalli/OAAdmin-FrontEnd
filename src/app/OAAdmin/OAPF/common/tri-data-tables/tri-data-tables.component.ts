import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { oapfcommonService } from '../../../shared/oapfcommon.service'
import { TableColumn } from './tableColumn';

@Component({
  selector: 'app-tri-data-tables',
  templateUrl: './tri-data-tables.component.html',
  styleUrls: ['./tri-data-tables.component.scss']
})
export class TriDataTablesComponent implements OnInit {
  dataSource: any = new MatTableDataSource<any>();
  @Input('mode') mode: any
  @Input('displayedColumns') displayedColumns: any
  @Input('fDisplayedColumns') fDisplayedColumns: any
  @Input('functionType') functionType: any
  @Input() url:any
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData: any
  private subscriptions: Subscription[] = [];


  //
  @Input() columns: Array<TableColumn>;
  authRoles: any;

  constructor(public oapfcommonService: oapfcommonService,public authService: AuthService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.getDataTables(this.url);
  }

  public getDataTables(url:any) {
    console.log('Get Invoices' + this.displayedColumns)
    console.log('Get Invoices' + this.fDisplayedColumns)
    let sb
    sb = this.oapfcommonService.getDataWithPagination(url,this.currentPage, this.pageSize, this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
      console.log(this.totalRows)
    });
    this.subscriptions.push(sb);
  }

  drop($event: any) {

  }

  sortChanges($event: any) {

  }

  openEdit(element:any, edit: any) {

  }

  openTransaction(element:any, view: any) {

  }

  openAuth(element:any, auth: any) {

  }

  openDelete(deleteContent: any, element:any) {

  }

  openHistroy(element: any, viewHistory: any) {

  }
}
