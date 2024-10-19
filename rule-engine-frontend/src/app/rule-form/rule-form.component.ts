import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RuleService } from '../services/rule.services';

@Component({
  selector: 'app-rule-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './rule-form.component.html',
})
export class RuleFormComponent implements OnInit {
  ruleForm!: FormGroup;
  submitted = false;
  success: string | null = null;
  error: string | null = null;

  constructor(private formBuilder: FormBuilder, private ruleService: RuleService) {}

  ngOnInit(): void {
    this.ruleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      ruleString: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.success = null;
    this.error = null;

    if (this.ruleForm.invalid) {
      return;
    }

    const ruleData = {
      name: this.ruleForm.get('name')?.value,
      ruleString: this.ruleForm.get('ruleString')?.value,
    };

    console.log('Submitting rule data:', ruleData);

    this.ruleService.createRule(ruleData).subscribe({
      next: (response) => {
        console.log('Rule created successfully:', response);
        this.success = 'Rule created successfully!';
        this.ruleForm.reset();
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error creating rule:', error);
        this.error = 'Failed to create rule: ' + error.message;
      },
    });
  }
}