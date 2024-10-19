import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RuleService, Rule, EvaluationResult } from '../services/rule.services';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {
  rules: Rule[] = [];
  validationForm: FormGroup;
  evaluationResult: boolean | null = null;
  errorMessage: string | null = null;

  constructor(private ruleService: RuleService, private fb: FormBuilder) {
    this.validationForm = this.fb.group({
      selectedRuleId: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      department: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      experience: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.ruleService.getRules().subscribe({
      next: (rules) => this.rules = rules,
      error: (error) => {
        console.error('Error loading rules:', error);
        this.errorMessage = 'Failed to load rules. Please try again later.';
      }
    });
  }

  evaluateRule() {
    if (this.validationForm.valid) {
      const formData = this.validationForm.value;
      const ruleId = formData.selectedRuleId;
      const data = {
        data: {
          age: formData.age,
          department: formData.department,
          salary: formData.salary,
          experience: formData.experience
        }
      };

      this.ruleService.evaluateRule(ruleId, data).subscribe({
        next: (result: EvaluationResult) => {
          this.evaluationResult = result.result;
          this.errorMessage = null;
        },
        error: (error) => {
          console.error('Error evaluating rule:', error);
          this.evaluationResult = null;
          this.errorMessage = 'Failed to evaluate rule. Please try again.';
        }
      });
    }
  }
}