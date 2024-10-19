import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Add this line
import { AppComponent } from './app.component';
import { RuleFormComponent } from './rule-form/rule-form.component';
import { RuleManagementComponent } from './rule-management/rule-management.component';
import { CombineRulesComponent } from './combine-rules/combine-rules.component';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    RuleFormComponent,
    RuleManagementComponent,
    CombineRulesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }