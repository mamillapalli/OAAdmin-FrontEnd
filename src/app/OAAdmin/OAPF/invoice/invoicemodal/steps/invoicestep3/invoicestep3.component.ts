import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/request/rm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-invoicestep3',
  templateUrl: './invoicestep3.component.html',
  styleUrls: ['./invoicestep3.component.scss']
})
export class Invoicestep3Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
