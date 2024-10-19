import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RuleService } from '../services/rule.services';

@Component({
  selector: 'app-combine-rules',
  templateUrl: './combine-rules.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CombineRulesComponent {
  ruleId1: string = '';
  ruleId2: string = '';
  combinedRule: any | null = null;
  error: string | null = null;

  constructor(private ruleService: RuleService) {}

  combineRules(): void {
    if (!this.ruleId1 || !this.ruleId2) {
      this.error = 'Please enter both Rule ID 1 and Rule ID 2.';
      return;
    }

    const ruleIds = [this.ruleId1, this.ruleId2];

    this.ruleService.combineRules(ruleIds).subscribe({
      next: (response) => {
        this.combinedRule = response;
        this.error = null;
      },
      error: (err) => {
        this.error = `Failed to combine rules: ${err.message}`;
        this.combinedRule = null;
      }
    });
  }
}