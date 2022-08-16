import { Routes } from '@angular/router';
import {SuperAdminModuleComponent} from "../OAAdmin/Admin/super-admin-module/super-admin-module.component";
import {BankadminMaintenanceComponent} from "../OAAdmin/Admin/bankadmin-maintenance/bankadmin-maintenance.component";
import {CorporateadminComponent} from "../OAAdmin/Admin/corporateadmin/corporateadmin.component";
import {CorporatesComponent} from "../OAAdmin/Admin/corporates/corporates.component";
import {CorporateuserComponent} from "../OAAdmin/Admin/corporateuser/corporateuser.component";
import {BankuserComponent} from "../OAAdmin/Admin/bankuser/bankuser.component";
import {RelationshipmanagerComponent} from "../OAAdmin/Admin/relationshipmanager/relationshipmanager.component";
import {InvoiceComponent} from "../OAAdmin/OAPF/invoice/invoice.component";
import {AccountModule} from "../modules/account/account.module";
import {AccountsComponent} from "../OAAdmin/Admin/accounts/accounts.component";
import {FinancingComponent} from "../OAAdmin/OAPF/financing/financing.component";
import {SettlementComponent} from "../OAAdmin/OAPF/settlement/settlement.component";
import {ApprovalinvoicesModule} from "../OAAdmin/OAPF/approvalinvoices/approvalinvoices.module";
import {ExChangeRatesComponent} from "../OAData/ex-change-rates/ex-change-rates.component";
import {AgreementComponent} from "../OAAdmin/Customer/agreement/agreement.component";
import {SBRComponent} from "../OAAdmin/Customer/sbr/sbr.component";
import { CurrencyComponent } from '../OAData/StanData/currency/currency.component';
import { InterestRateComponent } from '../OAData/StanData/interest-rate/interest-rate.component';
import { ExchangeRateComponent } from '../OAData/StanData/exchange-rate/exchange-rate.component';
import { HolidayComponent } from '../OAData/StanData/holiday/holiday.component';
import { NewsbrComponent } from '../OAAdmin/Customer/newsbr/newsbr.component';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  // {
  //   path: 'apps/chat',
  //   loadChildren: () =>
  //     import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  // },
  {
    path: 'superadmin', // <= Page URL
    component: SuperAdminModuleComponent // <= Page component registration
  },
  {
    path: 'bankadmin', // <= Page URL
    component: BankadminMaintenanceComponent // <= Page component registration
  },
  {
    path: 'corporateadmin', // <= Page URL
    component: CorporateadminComponent // <= Page component registration
  },
  {
    path: 'corporates', // <= Page URL
    component: CorporatesComponent // <= Page component registration
  },
  {
    path: 'corporateuser', // <= Page URL
    component: CorporateuserComponent // <= Page component registration
  },
  {
    path: 'bankuser', // <= Page URL
    component: BankuserComponent // <= Page component registration
  },
  {
    path: 'relationshipmanager', // <= Page URL
    component: RelationshipmanagerComponent // <= Page component registration
  },
  //Account number
  {
    path: 'accounts',
    component: AccountsComponent
  },
  {
    path: 'exchangerates',
    component: ExChangeRatesComponent
  },
  // Invoices
  {
    path: 'OAPF/invoice', // <= Page URL
    component: InvoiceComponent // <= Page component registration
  },
  // Financing
  {
    path: 'OAPF/financing', // <= Page URL
    component: FinancingComponent // <= Page component registration
  },
  // payment
  {
    path: 'OAPF/payments', // <= Page URL
    component: SettlementComponent // <= Page component registration
  },
  // {
  //   path: 'OAPF/approvalinvoices',
  //   loadChildren: () =>
  //     import('../OAAdmin/OAPF/approvalinvoices/approvalinvoices.module').then((m) => m.ApprovalinvoicesModule),
  // },
  {
    path: 'approvalinvoices',
    loadChildren: () =>
      import('../OAAdmin/OAPF/approvalinvoices/approvalinvoices.module').then((m) => m.ApprovalinvoicesModule),
  },

  {
    path: 'systemmaintenance',
    loadChildren: () =>
      import('../OAAdmin/Admin/system-maintenance/system-maintenance.module').then((m) => m.SystemMaintenanceModule),
  },
  {
    path: 'currency', // <= Page URL
    component: CurrencyComponent // <= Page component registration
  },
  {
    path: 'interestrate', // <= Page URL
    component: InterestRateComponent // <= Page component registration
  },
  {
    path: 'exchangerate', // <= Page URL
    component: ExchangeRateComponent // <= Page component registration
  },
  {
    path: 'holiday', // <= Page URL
    component: HolidayComponent // <= Page component registration
  },
  {
    path: 'Customer/agreement', // <= Page URL
    component: AgreementComponent // <= Page component registration
  },
  {
    path: 'Customer/sbr', // <= Page URL
    component: NewsbrComponent // <= Page component registration
  },


  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
