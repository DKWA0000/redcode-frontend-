import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterQuote } from './alter-quote';

describe('AlterQuote', () => {
  let component: AlterQuote;
  let fixture: ComponentFixture<AlterQuote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlterQuote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterQuote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
