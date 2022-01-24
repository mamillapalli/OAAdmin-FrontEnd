import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/OAAdmin/Request/rm";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporates} from "../../../../../Model/OAAdmin/Request/corporates";

@Component({
  selector: 'app-relationshipmanagerstep2',
  templateUrl: './relationshipmanagerstep2.component.html',
  styleUrls: ['./relationshipmanagerstep2.component.scss']
})
export class Relationshipmanagerstep2Component implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }


}
