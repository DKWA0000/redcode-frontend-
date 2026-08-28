import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQuotes } from './show-quotes';

describe('ShowQuotes', () => {
  let component: ShowQuotes;
  let fixture: ComponentFixture<ShowQuotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowQuotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowQuotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
