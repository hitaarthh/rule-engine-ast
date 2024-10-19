import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RuleFormComponent } from './rule-form/rule-form.component';
import { RuleManagementComponent } from './rule-management/rule-management.component';
import { CombineRulesComponent } from './combine-rules/combine-rules.component';
import { ValidationComponent } from './validation/validation.component';
import { NgModule } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RuleFormComponent,
    RuleManagementComponent,
    CombineRulesComponent,
    ValidationComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Rule Engine Frontend';
  isHome = true;

  // Method to show the home page
  showHome() {
    console.log('Showing home');

    this.isHome = true;
  }

  // Method to show the about page
  showAbout() {
    console.log('Showing about');

    this.isHome = false;
  }
  
}