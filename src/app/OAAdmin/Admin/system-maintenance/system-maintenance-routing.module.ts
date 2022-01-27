import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SystemMaintenanceComponent} from "./system-maintenance.component";
import {BatchManagerComponent} from "./batch-manager/batch-manager.component";

const routes: Routes = [
  {
    path: '',
    component: SystemMaintenanceComponent,
    children: [
      {
        path: 'batchmanager',
        component: BatchManagerComponent,
      },
      { path: '', redirectTo: 'batchmanager', pathMatch: 'full' },
      { path: '**', redirectTo: 'batchmanager', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemMaintenanceRoutingModule {}
