import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ApprovalinvoicesComponent} from "./approvalinvoices.component";
import {ApprovalinvoicesbuyerComponent} from "./approvalinvoicesbuyer/approvalinvoicesbuyer.component";
import {ApprovalinvoicessellerComponent} from "./approvalinvoicesseller/approvalinvoicesseller.component";

const routes: Routes = [
  {
    path: '',
    component: ApprovalinvoicesComponent,
    children: [
      {
        path: 'buyerapprovalinvoices',
        component: ApprovalinvoicesbuyerComponent,
      },
      {
        path: 'sellerapprovalinvoices',
        component: ApprovalinvoicessellerComponent,
      },

      { path: '', redirectTo: 'private-chat', pathMatch: 'full' },
      { path: '**', redirectTo: 'private-chat', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalinvoicesRoutingModule {}
