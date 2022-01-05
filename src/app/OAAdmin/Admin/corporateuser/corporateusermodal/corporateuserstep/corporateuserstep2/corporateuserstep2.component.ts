import {DatePipe, formatDate} from "@angular/common";
import {Component, OnInit} from "@angular/core";


@Component({
  providers:[DatePipe],
  selector: 'app-corporateuserstep2',
  templateUrl: './corporateuserstep2.component.html',
  styleUrls: ['./corporateuserstep2.component.scss',
  ]
})
export class Corporateuserstep2Component implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
