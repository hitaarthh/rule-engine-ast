import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineRulesComponent } from './combine-rules.component';

describe('CombineRulesComponent', () => {
  let component: CombineRulesComponent;
  let fixture: ComponentFixture<CombineRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombineRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombineRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
