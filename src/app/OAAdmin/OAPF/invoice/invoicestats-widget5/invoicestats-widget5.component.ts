import { Component, Input } from '@angular/core';
import {oapfcommonService} from "../../../shared/oapfcommon.service";
import {count} from "rxjs/operators";

@Component({
  selector: 'app-invoicestats-widget5',
  templateUrl: './Invoicestats-widget5.component.html',
})
export class InvoicestatsWidget5Component {
  @Input() progress:any = '';
  @Input() color = '';
  @Input() description = '';
  @Input() title = '';

  constructor(public oapfcommonService: oapfcommonService) {}

  ngOnInit() {
    const sb = this.oapfcommonService.getDataWithPagination('/oapf/api/v1/invoices/', 0, 0, '').subscribe((res) => {
      console.log(res.content.length)
      const masterRecord = res.content.transactionStatus//.value('MASTER').length
      console.log(masterRecord)
      let count=0
      for(let i =0;i< res.content.length; i++)
      {
        if(res.content[i].transactionStatus === 'MASTER')
        {
          count++
           console.log(count)
        }
      }
      this.progress = Math.round(count * 100  / 100);
    })
  }
}
