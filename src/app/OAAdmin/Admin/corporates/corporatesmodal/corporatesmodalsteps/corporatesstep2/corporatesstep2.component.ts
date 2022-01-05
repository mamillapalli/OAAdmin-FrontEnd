import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {corporates} from "../../../../../Model/OAAdmin/Request/corporates";

@Component({
  selector: 'app-corporatesstep2',
  templateUrl: './corporatesstep2.component.html',
  styleUrls: ['./corporatesstep2.component.scss']
})
export class Corporatesstep2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
