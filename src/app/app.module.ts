import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CommonModule, DatePipe} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {AdminStep2Component} from "./OAAdmin/Admin/super-admin-module/super-admin-modal/steps/adminstep2/adminstep2.component";
import {AuthService} from "./modules/auth";
import {BankadminMaintenanceComponent} from "./OAAdmin/Admin/bankadmin-maintenance/bankadmin-maintenance.component";
import {Bankadminstep1Component} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminstep/bankadminstep1/bankadminstep1.component";
import {Bankadminstep2Component} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminstep/bankadminstep2/bankadminstep2.component";
import {Bankadminstep3Component} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminstep/bankadminstep3/bankadminstep3.component";
import {BankadminmodalComponent} from "./OAAdmin/Admin/bankadmin-maintenance/bankadminmodal/bankadminmodal.component";
import {NgSelectModule} from "@ng-select/ng-select";
import { Attributes, IntersectionObserverHooks, LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';
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
import { RelationshipmanagerComponent } from './OAAdmin/Admin/relationshipmanager/relationshipmanager.component';
import { RelationshipmanagermodalComponent } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/relationshipmanagermodal.component';
import { Relationshipmanagerstep1Component } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep1/relationshipmanagerstep1.component';
import { Relationshipmanagerstep2Component } from './OAAdmin/Admin/relationshipmanager/relationshipmanagermodal/steps/relationshipmanagerstep2/relationshipmanagerstep2.component';
import { InvoiceComponent } from './OAAdmin/OAPF/invoice/invoice.component';
import { InvoicemodalComponent } from './OAAdmin/OAPF/invoice/invoicemodal/invoicemodal.component';
import { Invoicestep1Component } from './OAAdmin/OAPF/invoice/invoicemodal/steps/invoicestep1/invoicestep1.component';
import { Invoicestep2Component } from './OAAdmin/OAPF/invoice/invoicemodal/steps/invoicestep2/invoicestep2.component';
import { AccountsComponent } from './OAAdmin/Admin/accounts/accounts.component';
import { AccountmodalComponent } from './OAAdmin/Admin/accounts/accountmodal/accountmodal.component';
import { Accountstep1Component } from './OAAdmin/Admin/accounts/accountmodal/steps/accountstep1/accountstep1.component';
import { Accountstep2Component } from './OAAdmin/Admin/accounts/accountmodal/steps/accountstep2/accountstep2.component';
import { FinancingComponent } from './OAAdmin/OAPF/financing/financing.component';
import { FinancingmodalComponent } from './OAAdmin/OAPF/financing/financingmodal/financingmodal.component';
import { Financingstep1Component } from './OAAdmin/OAPF/financing/financingmodal/steps/financingstep1/financingstep1.component';
import { Financingstep2Component } from './OAAdmin/OAPF/financing/financingmodal/steps/financingstep2/financingstep2.component';
import { SbrdatamodalComponent } from './OAAdmin/OAPF/common/sbrdatamodal/sbrdatamodal.component';
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
import { ReterivecustomersmodalComponent } from './OAAdmin/Admin/common/reterivecustomersmodal/reterivecustomersmodal.component';
import { InvoicehistroyComponent } from './OAAdmin/OAPF/common/invoicehistroy/invoicehistroy.component';
import { VouchermodalComponent } from './OAAdmin/OAPF/common/vouchermodal/vouchermodal.component';
import { SystemMaintenanceComponent } from './OAAdmin/Admin/system-maintenance/system-maintenance.component';
import { ExChangeRatesComponent } from './OAData/ex-change-rates/ex-change-rates.component';
import { ExChangeRatesModalComponent } from './OAData/ex-change-rates/ex-change-rates-modal/ex-change-rates-modal.component';
import { ExChangeRatesStep1Component } from './OAData/ex-change-rates/ex-change-rates-modal/steps/ex-change-rates-step1/ex-change-rates-step1.component';
import { ExChangeRatesStep2Component } from './OAData/ex-change-rates/ex-change-rates-modal/steps/ex-change-rates-step2/ex-change-rates-step2.component';
import { AgreementComponent} from "./OAAdmin/Customer/agreement/agreement.component";
import { AgreementMainComponent } from './OAAdmin/Customer/agreement/agreementmodal/agreement-main/agreement-main.component';
import { AgreementLimitComponent } from './OAAdmin/Customer/agreement/agreementmodal/agreement-limit/agreement-limit.component';
import { AgreementEndComponent } from './OAAdmin/Customer/agreement/agreementmodal/agreement-end/agreement-end.component';
import { AgreementmodalComponent } from './OAAdmin/Customer/agreement/agreementmodal/agreementmodal.component';
import { SBRComponent} from "./OAAdmin/Customer/sbr/sbr.component";
import {SbrmodalComponent} from "./OAAdmin/Customer/sbr/sbrmodal/sbrmodal.component";
import { SbrCustomerComponent } from './OAAdmin/Customer/sbr/sbrmodal/sbr-customer/sbr-customer.component';
import { SbrAmtInfoComponent } from './OAAdmin/Customer/sbr/sbrmodal/sbr-amt-info/sbr-amt-info.component';
import { SbrEndComponent } from './OAAdmin/Customer/sbr/sbrmodal/sbr-end/sbr-end.component';
import { CustomerDOComponent } from './OAAdmin/common/customer-do/customer-do.component';
import { RmDoComponent } from './OAAdmin/common/rm-do/rm-do.component';
import { CurrencyComponent } from './OAData/StanData/currency/currency.component';
import { HolidayComponent } from './OAData/StanData/holiday/holiday.component';
import { ExchangeRateComponent } from './OAData/StanData/exchange-rate/exchange-rate.component';
import { InterestRateComponent } from './OAData/StanData/interest-rate/interest-rate.component';
import { WeekEndComponent } from './OAData/StanData/week-end/week-end.component';
import { CurrencyModalComponent } from './OAData/StanData/currency/currency-modal/currency-modal.component';
import { MainComponent } from './OAData/StanData/currency/currency-modal/main/main.component';
import { EndComponent } from './OAData/StanData/currency/currency-modal/end/end.component';
import { ExchangeEndComponent } from './OAData/StanData/exchange-rate/exchange-rate-modal/exchange-end/exchange-end.component';
import { ExchangeMainComponent } from './OAData/StanData/exchange-rate/exchange-rate-modal/exchange-main/exchange-main.component';
import { ExchangeRateModalComponent } from './OAData/StanData/exchange-rate/exchange-rate-modal/exchange-rate-modal.component';
import { InterestRateModalComponent } from './OAData/StanData/interest-rate/interest-rate-modal/interest-rate-modal.component';
import { InterestRateMainComponent } from './OAData/StanData/interest-rate/interest-rate-modal/interest-rate-main/interest-rate-main.component';
import { InterestRateEndComponent } from './OAData/StanData/interest-rate/interest-rate-modal/interest-rate-end/interest-rate-end.component';
import { HolidayModalComponent } from './OAData/StanData/holiday/holiday-modal/holiday-modal.component';
import { HolidayMainComponent } from './OAData/StanData/holiday/holiday-modal/holiday-main/holiday-main.component';
import { HolidayEndComponent } from './OAData/StanData/holiday/holiday-modal/holiday-end/holiday-end.component';
import { CreditAdviseComponent } from './OAAdmin/credit-advise/credit-advise.component';

import {ChartComponent} from "ng-apexcharts";
import {NgChartsModule} from "ng2-charts";
import {CRUDTableModule} from "./_metronic/shared/crud-table";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
//import { ApprovalinvoicesComponent } from './OAAdmin/OAPF/approvalinvoices/approvalinvoices.component';
import "reflect-metadata";
import { CopyAsModalComponent } from './OAAdmin/OAPF/common/copy-as-modal/copy-as-modal.component';
import { AgreementDoComponent } from './OAAdmin/common/agreement-do/agreement-do.component';
import {HolidayInfoComponent} from "./OAData/StanData/holiday/holiday-modal/holiday-info/holiday-info.component";
import {AngularMultiSelectModule} from "angular2-multiselect-dropdown";
import { TriDataTablesComponent } from './OAAdmin/OAPF/common/tri-data-tables/tri-data-tables.component';
import { SbrMainComponent } from './OAAdmin/Customer/sbr/sbrmodal/sbr-main/sbr-main.component';
import { NewsbrComponent } from './OAAdmin/Customer/newsbr/newsbr.component';
import { NewsbrmodalComponent } from './OAAdmin/Customer/newsbr/newsbrmodal/newsbrmodal.component';
import { NewsbrmainComponent } from './OAAdmin/Customer/newsbr/newsbrmodal/newsbrmain/newsbrmain.component';
import { NewsbramtinfoComponent } from './OAAdmin/Customer/newsbr/newsbrmodal/newsbramtinfo/newsbramtinfo.component';
import { NewsbrendComponent } from './OAAdmin/Customer/newsbr/newsbrmodal/newsbrend/newsbrend.component';

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

export class LazyLoadImageHooks extends IntersectionObserverHooks {
  onAttributeChange(newAttributes: Attributes) {
    console.log(`New attributes: ${newAttributes}`);
  }
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
    RelationshipmanagerComponent,
    RelationshipmanagermodalComponent,
    Relationshipmanagerstep1Component,
    Relationshipmanagerstep2Component,
    InvoiceComponent,
    InvoicemodalComponent,
    Invoicestep1Component,
    Invoicestep2Component,
    AccountsComponent,
    AccountmodalComponent,
    Accountstep1Component,
    Accountstep2Component,
    FinancingComponent,
    FinancingmodalComponent,
    Financingstep1Component,
    Financingstep2Component,
    SbrdatamodalComponent,
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
    ReterivecustomersmodalComponent,
    InvoicehistroyComponent,
    Corporateuserstep2Component,
    VouchermodalComponent,
    SystemMaintenanceComponent,
    ExChangeRatesComponent,
    ExChangeRatesModalComponent,
    ExChangeRatesStep1Component,
    ExChangeRatesStep2Component,
    CopyAsModalComponent,
    AgreementComponent,
    AgreementmodalComponent,
    AgreementMainComponent,
    AgreementLimitComponent,
    AgreementEndComponent,
    SBRComponent,
    SbrmodalComponent,
    SbrMainComponent,
    SbrCustomerComponent,
    SbrAmtInfoComponent,
    SbrEndComponent,
    CustomerDOComponent,
    RmDoComponent,
    CurrencyComponent,
    HolidayComponent,
    ExchangeRateComponent,
    InterestRateComponent,
    WeekEndComponent,
    CurrencyModalComponent,
    MainComponent,
    EndComponent,
    ExchangeMainComponent,
    ExchangeEndComponent,
    InterestRateMainComponent,
    InterestRateEndComponent,
    ExchangeRateModalComponent,
    InterestRateModalComponent,
    HolidayModalComponent,
    HolidayMainComponent,
    HolidayEndComponent,
    CreditAdviseComponent,
    AgreementDoComponent,
    SbrdatamodalComponent,
    HolidayInfoComponent,
    TriDataTablesComponent,
    NewsbrComponent,
    NewsbrmodalComponent,
    NewsbrmainComponent,
    NewsbramtinfoComponent,
    NewsbrendComponent
    //ApprovalinvoicesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
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
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    NgxSpinnerModule,
    MatTableExporterModule,
    CdkTableExporterModule,
    NgxCurrencyModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgChartsModule,
    CRUDTableModule,
    NgxMatSelectSearchModule,
    AngularMultiSelectModule,
    LazyLoadImageModule
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
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks }
    // {
    //   provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
