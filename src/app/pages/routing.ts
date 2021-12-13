import { Routes } from '@angular/router';
import {SuperAdminModuleComponent} from "../OAAdmin/Admin/super-admin-module/super-admin-module.component";
import {BankadminMaintenanceComponent} from "../OAAdmin/Admin/bankadmin-maintenance/bankadmin-maintenance.component";
import {CorporateadminComponent} from "../OAAdmin/Admin/corporateadmin/corporateadmin.component";
import {CorporatesComponent} from "../OAAdmin/Admin/corporates/corporates.component";
import {CorporateuserComponent} from "../OAAdmin/Admin/corporateuser/corporateuser.component";
import {BankuserComponent} from "../OAAdmin/Admin/bankuser/bankuser.component";
import {RmComponent} from "../OAAdmin/Admin/rm/rm.component";
import {TestComponent} from "../OAAdmin/Admin/test/test.component";
import {RelationshipmanagerComponent} from "../OAAdmin/Admin/relationshipmanager/relationshipmanager.component";
import {InvoiceComponent} from "../OAAdmin/OAPF/invoice/invoice.component";

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
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
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
    path: 'rm', // <= Page URL
    component: RmComponent // <= Page component registration
  },
  {
    path: 'test', // <= Page URL
    component: TestComponent // <= Page component registration
  },
  {
    path: 'relationshipmanager', // <= Page URL
    component: RelationshipmanagerComponent // <= Page component registration
  },
  {
    path: 'OAPF/invoice', // <= Page URL
    component: InvoiceComponent // <= Page component registration
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
