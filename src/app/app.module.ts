import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from 'angular-datatables';
import { SuperAdminModuleComponent } from './OAAdmin/Admin/super-admin-module/super-admin-module.component';
import { SuperAdminModalComponent } from './OAAdmin/Admin/super-admin-module/super-admin-modal/super-admin-modal.component';
import {AdminStep1Component} from "./OAAdmin/Admin/super-admin-module/super-admin-modal/steps/adminstep1/adminstep1.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AdminStep2Component} from "./OAAdmin/Admin/super-admin-module/super-admin-modal/steps/adminstep2/adminstep2.component";
import {AdminStep3Component} from "./OAAdmin/Admin/super-admin-module/super-admin-modal/steps/adminstep3/adminstep3.component";
import {AdminStep4Component} from "./OAAdmin/Admin/super-admin-module/super-admin-modal/steps/adminstep4/adminstep4.component";
import {AdminStep5Component} from "./OAAdmin/Admin/super-admin-module/super-admin-modal/steps/adminstep5/step5.component";
import {AuthService} from "./modules/auth";
import {BankadminMaintenanceComponent} from "./OAAdmin/Admin/bankadmin-maintenance/bankadmin-maintenance.component";
import {Bankadminstep1Component} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminstep/bankadminstep1/bankadminstep1.component";
import {Bankadminstep2Component} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminstep/bankadminstep2/bankadminstep2.component";
import {Bankadminstep3Component} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminstep/bankadminstep3/bankadminstep3.component";
import {BankadminmodalComponent} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminmodal.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {DatePipe} from "@angular/common";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
// #fake-end#
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { CorporateadminComponent } from './OAAdmin/Admin/corporateadmin/corporateadmin.component';
import { CorporateadminmodalComponent } from './OAAdmin/Admin/corporateadmin/corporateadminmodal/corporateadminmodal.component';
import {Corporateadminstep1Component} from "./OAAdmin/Admin/corporateadmin/corporateadminmodal/coporateadminstep/corporateadminstep1/corporateadminstep1.component";
import {Corporateadminstep2Component} from "./OAAdmin/Admin/corporateadmin/corporateadminmodal/coporateadminstep/corporateadminstep2/corporateadminstep2.component";
import {Corporateadminstep3Component} from "./OAAdmin/Admin/corporateadmin/corporateadminmodal/coporateadminstep/corporateadminstep3/corporateadminstep3.component";
import { CorporatecustomermodalComponent } from './OAAdmin/Admin/corporateadmin/corporateadminmodal/coporateadminstep/corporateadminstep1/corporatecustomermodal/corporatecustomermodal.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { CorporatesComponent } from './OAAdmin/Admin/corporates/corporates.component';
import { CorporatesmodalComponent } from './OAAdmin/Admin/corporates/corporatesmodal/corporatesmodal.component';
import {Corporatesstep1Component} from "./OAAdmin/Admin/corporates/corporatesmodal/corporatesmodalsteps/corporatesstep1/corporatesstep1.component";
import {Corporatesstep2Component} from "./OAAdmin/Admin/corporates/corporatesmodal/corporatesmodalsteps/corporatesstep2/corporatesstep2.component";
import {Corporatesstep3Component} from "./OAAdmin/Admin/corporates/corporatesmodal/corporatesmodalsteps/corporatesstep3/corporatesstep3.component";
import { BankuserComponent } from './OAAdmin/Admin/bankuser/bankuser.component';
import { CorporateuserComponent } from './OAAdmin/Admin/corporateuser/corporateuser.component';
import { CorporateusermodalComponent } from './OAAdmin/Admin/corporateuser/corporateusermodal/corporateusermodal.component';
import { Corporateuserstep1Component } from './OAAdmin/Admin/corporateuser/corporateusermodal/corporateuserstep/corporateuserstep1/corporateuserstep1.component';
import { Corporateuserstep2Component } from './OAAdmin/Admin/corporateuser/corporateusermodal/corporateuserstep/corporateuserstep2/corporateuserstep2.component';
import { Corporateuserstep3Component } from './OAAdmin/Admin/corporateuser/corporateusermodal/corporateuserstep/corporateuserstep3/corporateuserstep3.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BankusermodalComponent } from './OAAdmin/Admin/bankuser/bankusermodal/bankusermodal.component';
import { Bankuserstep1Component } from './OAAdmin/Admin/bankuser/bankusermodal/bankusersteps/bankuserstep1/bankuserstep1.component';
import { Bankuserstep2Component } from './OAAdmin/Admin/bankuser/bankusermodal/bankusersteps/bankuserstep2/bankuserstep2.component';
import { Bankuserstep3Component } from './OAAdmin/Admin/bankuser/bankusermodal/bankusersteps/bankuserstep3/bankuserstep3.component';
import {RmComponent} from "./OAAdmin/Admin/rm/rm.component";
import {RmmodalComponent} from "./OAAdmin/Admin/rm/rmmodal/rmmodal.component";
import { Rmstep1Component } from './OAAdmin/Admin/rm/rmmodal/rmsteps/rmstep1/rmstep1.component';
import { Rmstep2Component } from './OAAdmin/Admin/rm/rmmodal/rmsteps/rmstep2/rmstep2.component';
import { Rmstep3Component } from './OAAdmin/Admin/rm/rmmodal/rmsteps/rmstep3/rmstep3.component';
import { Rmstep4Component } from './OAAdmin/Admin/rm/rmmodal/rmsteps/rmstep4/rmstep4.component';
import { TestComponent } from './OAAdmin/Admin/test/test.component';
import { TestmodalComponent } from './OAAdmin/Admin/test/testmodal/testmodal.component';
import {Step1Component} from "./OAAdmin/Admin/test/testmodal/steps/step1/step1.component";
import {Step2Component} from "./OAAdmin/Admin/test/testmodal/steps/step2/step2.component";
import {Step3Component} from "./OAAdmin/Admin/test/testmodal/steps/step3/step3.component";
import {Step4Component} from "./OAAdmin/Admin/test/testmodal/steps/step4/step4.component";
import {Step5Component} from "./OAAdmin/Admin/test/testmodal/steps/step5/step5.component";
import { CustomermodalComponent } from './OAAdmin/Admin/rm/rmmodal/rmsteps/rmstep3/customermodal/customermodal.component';
import { CustomerstablemodalComponent } from './OAAdmin/Admin/rm/rmmodal/rmsteps/rmstep3/customermodal/customerstablemodal/customerstablemodal.component';
import { RelationshipmanagerComponent } from './OAAdmin/Admin/relationshipmanager/relationshipmanager.component';
import { RelationshipmanagermodalComponent } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/relationshipmanagermodal.component';
import { Relationshipmanagerstep1Component } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep1/relationshipmanagerstep1.component';
import { Relationshipmanagerstep2Component } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep2/relationshipmanagerstep2.component';
import { Relationshipmanagerstep3Component } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep3/relationshipmanagerstep3.component';
import { Relationshipmanagerstep4Component } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep4/relationshipmanagerstep4.component';
import { RelcustmodalComponent } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep3/relcustmodal/relcustmodal.component';
import { RelcustablemodalComponent } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep3/relcustmodal/relcustablemodal/relcustablemodal.component';
import { InvoiceComponent } from './OAAdmin/OAPF/invoice/invoice.component';
import { InvoicemodalComponent } from './OAAdmin/OAPF/invoice/invoicemodal/invoicemodal.component';
import { Invoicestep1Component } from './OAAdmin/OAPF/invoice/invoicemodal/steps/invoicestep1/invoicestep1.component';
import { Invoicestep2Component } from './OAAdmin/OAPF/invoice/invoicemodal/steps/invoicestep2/invoicestep2.component';
import { Invoicestep3Component } from './OAAdmin/OAPF/invoice/invoicemodal/steps/invoicestep3/invoicestep3.component';
import { Invoicestep4Component } from './OAAdmin/OAPF/invoice/invoicemodal/steps/invoicestep4/invoicestep4.component';
import { AccountsComponent } from './OAAdmin/Admin/accounts/accounts.component';
import { AccountmodalComponent } from './OAAdmin/Admin/accounts/accountmodal/accountmodal.component';
import { Accountstep1Component } from './OAAdmin/Admin/accounts/accountmodal/steps/accountstep1/accountstep1.component';
import { Accountstep2Component } from './OAAdmin/Admin/accounts/accountmodal/steps/accountstep2/accountstep2.component';
import { FinancingComponent } from './OAAdmin/OAPF/financing/financing.component';
import { FinancingmodalComponent } from './OAAdmin/OAPF/financing/financingmodal/financingmodal.component';
import { Financingstep1Component } from './OAAdmin/OAPF/financing/financingmodal/steps/financingstep1/financingstep1.component';
import { Financingstep2Component } from './OAAdmin/OAPF/financing/financingmodal/steps/financingstep2/financingstep2.component';
import { SbrmodalComponent } from './OAAdmin/OAPF/common/sbrmodal/sbrmodal.component';
import { InvoiceDOComponent } from './OAAdmin/OAPF/common/invoice-do/invoice-do.component';
import { Financingstep3Component } from './OAAdmin/OAPF/financing/financingmodal/steps/financingstep3/financingstep3.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { FilterComponent } from './OAAdmin/OAPF/common/filter/filter.component';
import { SettlementComponent } from './OAAdmin/OAPF/settlement/settlement.component';
import {CdkTableExporterModule, MatTableExporterModule} from "mat-table-exporter";
import { SettlementmodalComponent } from './OAAdmin/OAPF/settlement/settlementmodal/settlementmodal.component';
import { Settlementstep1Component } from './OAAdmin/OAPF/settlement/settlementmodal/steps/settlementstep1/settlementstep1.component';
import { Settlementstep2Component } from './OAAdmin/OAPF/settlement/settlementmodal/steps/settlementstep2/settlementstep2.component';
import { Settlementstep3Component } from './OAAdmin/OAPF/settlement/settlementmodal/steps/settlementstep3/settlementstep3.component';
import { FinancemodalComponent } from './OAAdmin/OAPF/common/financemodal/financemodal.component';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskInputMode, NgxCurrencyModule} from "ngx-currency";
import {AccountcommonmodalComponent} from "./OAAdmin/OAPF/common/accountcommonmodal/accountcommonmodal.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//import { ApprovalinvoicesComponent } from './OAAdmin/OAPF/approvalinvoices/approvalinvoices.component';

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  allowZero: false,
  nullable: false,
  align: "right",
  allowNegative: true,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ","
};

@NgModule({
  declarations: [
    AppComponent,
    SuperAdminModuleComponent,
    SuperAdminModalComponent,
    AdminStep1Component,
    AdminStep2Component,
    AdminStep3Component,
    AdminStep4Component,
    AdminStep5Component,
    BankadminMaintenanceComponent,
    BankadminmodalComponent,
    Bankadminstep1Component,
    Bankadminstep2Component,
    Bankadminstep3Component,
    CorporateadminComponent,
    CorporateadminmodalComponent,
    Corporateadminstep1Component,
    Corporateadminstep2Component,
    Corporateadminstep3Component,
    CorporatecustomermodalComponent,
    CorporatesComponent,
    CorporatesmodalComponent,
    Corporatesstep1Component,
    Corporatesstep2Component,
    Corporatesstep3Component,

    CorporateuserComponent,
    CorporateusermodalComponent,
    Corporateuserstep1Component,
    Corporateuserstep2Component,
    Corporateuserstep3Component,
    BankuserComponent,
    BankusermodalComponent,
    Bankuserstep1Component,
    Bankuserstep2Component,
    Bankuserstep3Component,
    RmComponent,
    RmmodalComponent,
    Rmstep1Component,
    Rmstep2Component,
    Rmstep3Component,
    Rmstep4Component,
    TestComponent,
    TestmodalComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    CustomermodalComponent,
    CustomerstablemodalComponent,
    RelationshipmanagerComponent,
    RelationshipmanagermodalComponent,
    Relationshipmanagerstep1Component,
    Relationshipmanagerstep2Component,
    Relationshipmanagerstep3Component,
    Relationshipmanagerstep4Component,
    CustomermodalComponent,
    CustomerstablemodalComponent,
    RelcustmodalComponent,
    RelcustablemodalComponent,
    InvoiceComponent,
    InvoicemodalComponent,
    Invoicestep1Component,
    Invoicestep2Component,
    Invoicestep3Component,
    Invoicestep4Component,
    AccountsComponent,
    AccountmodalComponent,
    Accountstep1Component,
    Accountstep2Component,
    FinancingComponent,
    FinancingmodalComponent,
    Financingstep1Component,
    Financingstep2Component,
    SbrmodalComponent,
    InvoiceDOComponent,
    Financingstep3Component,
    FilterComponent,
    SettlementComponent,
    SettlementmodalComponent,
    Settlementstep1Component,
    Settlementstep2Component,
    Settlementstep3Component,
    FinancemodalComponent,
    AccountcommonmodalComponent,
    //ApprovalinvoicesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
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
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    NgxSpinnerModule,
    MatTableExporterModule,
    CdkTableExporterModule,
    NgxCurrencyModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    DatePipe,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    // {
    //   provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
