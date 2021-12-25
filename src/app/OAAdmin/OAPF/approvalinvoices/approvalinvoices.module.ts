import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import {
  DropdownMenusModule,
  ChatInnerModule,
  CardsModule,
} from '../../../_metronic/partials';
import { ApprovalinvoicesbuyerComponent } from './approvalinvoicesbuyer/approvalinvoicesbuyer.component';
import { ApprovalinvoicessellerComponent } from './approvalinvoicesseller/approvalinvoicesseller.component';
import {ApprovalinvoicesComponent} from "./approvalinvoices.component";
import {ApprovalinvoicesRoutingModule} from "./approvalinvoices-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateModule} from "@ngx-translate/core";
import {HttpClientModule} from "@angular/common/http";
import {ClipboardModule} from "ngx-clipboard";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatBadgeModule} from "@angular/material/badge";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatStepperModule} from "@angular/material/stepper";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSliderModule} from "@angular/material/slider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTreeModule} from "@angular/material/tree";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ToastrModule} from "ngx-toastr";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";
import {CdkTableExporterModule, MatTableExporterModule} from "mat-table-exporter";
import {NgxCurrencyModule} from "ngx-currency";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    ApprovalinvoicesComponent,
    ApprovalinvoicesbuyerComponent,
    ApprovalinvoicessellerComponent,
  ],
  imports: [
    CommonModule,
    ApprovalinvoicesRoutingModule,
    DropdownMenusModule,
    ChatInnerModule,
    CardsModule,
    InlineSVGModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    InlineSVGModule.forRoot(),
    DataTablesModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatAutocompleteModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    NgbModule,
    NgxSpinnerModule,
    MatTableExporterModule,
    CdkTableExporterModule,
    NgxCurrencyModule,
  ],
})
export class ApprovalinvoicesModule {}
