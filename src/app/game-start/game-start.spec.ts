import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStart } from './game-start';

describe('GameStart', () => {
  let component: GameStart;
  let fixture: ComponentFixture<GameStart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameStart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameStart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
