import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recapcha } from './recapcha';

describe('Recapcha', () => {
  let component: Recapcha;
  let fixture: ComponentFixture<Recapcha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recapcha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recapcha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
