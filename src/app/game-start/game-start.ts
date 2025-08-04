import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-start.html',
  styleUrls: ['./game-start.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class GameStart implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this.location.replaceState('');
  }
  countdown = 3;
  isGameStarted = false;

  questionIndex = 0;
  currentQuestion: any = null;

  questionTime = 10; // เวลาต่อคำถาม (วินาที)
  timeLeft = this.questionTime;
  gameTimer: any;
  selectedAnswer: string | null = null;
  score = 0;
  maxScorePerQuestion = 10;

  questions = [
    {
      question: 'กรุงเทพฯ เป็นเมืองหลวงของประเทศใด?',
      choices: ['ญี่ปุ่น', 'ไทย', 'จีน', 'เกาหลี'],
      answer: 'ไทย',
    },
    {
      question: 'สีน้ำเงินผสมกับสีเหลืองจะได้สีอะไร?',
      choices: ['ส้ม', 'เขียว', 'ม่วง', 'ดำ'],
      answer: 'เขียว',
    },
  ];

  get totalQuestions(): number {
    return this.questions.length;
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.startCountdown();
  }

  startCountdown() {
    this.countdown = 3;
    const intervalId = setInterval(() => {
      this.zone.run(() => {
        this.countdown--;
        this.cd.detectChanges();
        console.log('Countdown:', this.countdown); // ตรวจสอบค่าลดลงไหม
        if (this.countdown <= 0) {
          clearInterval(intervalId);
          this.startGame();
        }
      });
    }, 1000);
  }

  startGame() {
    this.isGameStarted = true;
    this.questionIndex = 0;
    this.currentQuestion = this.questions[this.questionIndex];
    this.timeLeft = this.questionTime;
    this.cd.detectChanges();
    this.startTimer();
  }
  playSound(src: string) {
    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play().catch((err) => {
      console.warn('Unable to play sound:', err);
    });
  }
  startTimer() {
    if (this.gameTimer) clearInterval(this.gameTimer);

    this.gameTimer = setInterval(() => {
      this.zone.run(() => {
        this.timeLeft--;
        this.cd.detectChanges();
        if (this.timeLeft <= 0) {
          this.nextQuestion();
        }
      });
    }, 1000);
  }

  selectAnswer(choice: string) {
    clearInterval(this.gameTimer);
    this.selectedAnswer = choice;
    if (choice === this.currentQuestion.answer) {
      const gainedScore =
        (this.timeLeft / this.questionTime) * this.maxScorePerQuestion;
      this.score += Math.round(gainedScore);
      console.log(`ถูกต้อง! คุณได้ ${Math.round(gainedScore)} คะแนน`);
    } else {
      console.log('ผิด!');
    }

    this.nextQuestion();
  }

  nextQuestion() {
    this.questionIndex++;
    if (this.questionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.questionIndex];
      this.timeLeft = this.questionTime;
      this.cd.detectChanges();
      this.startTimer();
    } else {
      this.endGame();
    }
  }

  endGame() {
    this.currentQuestion = null;
    this.isGameStarted = false;
    this.cd.detectChanges();
  }
}
