import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCondition } from './game-condition';

describe('GameCondition', () => {
  let component: GameCondition;
  let fixture: ComponentFixture<GameCondition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCondition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameCondition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
