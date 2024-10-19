import { Routes } from '@angular/router';
import { RuleFormComponent } from './rule-form/rule-form.component';
import { RuleManagementComponent } from './rule-management/rule-management.component';
import { CombineRulesComponent } from './combine-rules/combine-rules.component'; // Add this

export const appRoutes: Routes = [
  { path: '', component: RuleFormComponent }, // Default route
  { path: 'manage-rules', component: RuleManagementComponent },
  { path: 'combine-rules', component: CombineRulesComponent }, // Add this
];
