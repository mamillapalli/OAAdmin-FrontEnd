import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/OAAdmin/Request/rm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-invoicestep2',
  templateUrl: './invoicestep2.component.html',
  styleUrls: ['./invoicestep2.component.scss']
})
export class Invoicestep2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
