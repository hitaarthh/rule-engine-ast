import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleService, Rule } from '../services/rule.services';

@Component({
  selector: 'app-rule-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.css']
})
export class RuleManagementComponent implements OnInit {
  rules: Rule[] = [];
  error: string | null = null;

  constructor(private ruleService: RuleService) {}

  ngOnInit(): void {
    console.log('RuleManagementComponent initialized');
    this.fetchRules();
  }

  fetchRules(): void {
    console.log('Fetching rules...');
    this.ruleService.getRules().subscribe({
      next: (rules) => {
        console.log('Rules fetched successfully:', rules);
        this.rules = rules;
      },
      error: (error) => {
        console.error('Error fetching rules:', error);
        this.error = `Failed to fetch rules. Error: ${error.message}`;
      }
    });
  }

  deleteRule(ruleId: string): void {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return; // Exit if the user cancels the deletion
    }

    this.ruleService.deleteRule(ruleId).subscribe({
      next: () => {
        // On successful deletion, remove the rule from the list
        this.rules = this.rules.filter(rule => rule._id !== ruleId);
      },
      error: (err) => {
        this.error = `Failed to delete rule: ${err.message}`;
      }
    });
  }
}