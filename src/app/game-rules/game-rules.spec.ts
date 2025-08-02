import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRules } from './game-rules';

describe('GameRules', () => {
  let component: GameRules;
  let fixture: ComponentFixture<GameRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
