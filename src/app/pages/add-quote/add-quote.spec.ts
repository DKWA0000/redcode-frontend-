import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuote } from './add-quote';

describe('AddQuote', () => {
  let component: AddQuote;
  let fixture: ComponentFixture<AddQuote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQuote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQuote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
