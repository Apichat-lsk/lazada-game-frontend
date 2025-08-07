import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
  NgZone,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import html2canvas from 'html2canvas';
import { QuestionsService } from '../../services/questions-service';
import { AuthService } from '../../services/auth-service';
import { AuthTokenService } from '../../component/auth-token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-start.html',
  styleUrls: ['./game-start.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class GameStart implements OnInit {
  @ViewChild('captureArea', { static: false }) captureArea!: ElementRef;
  constructor(
    private router: Router,
    private location: Location,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private service: QuestionsService,
    private authTokenService: AuthTokenService
  ) {
    this.location.replaceState('');
  }
  userData: any = {};
  email = '';
  countdown = 3;
  isGameStarted = false;
  currentDate = new Date();
  questionIndex = 0;
  currentQuestion: any = null;
  questionTime = 10;
  timeLeft = this.questionTime;
  gameTimer: any;
  selectedAnswer: string | null = null;
  score = 0;
  titleChoice = '';
  maxScorePerQuestion = 100;
  correctAnswers = 0;
  questions: any[] = [];
  resultQuestions: any[] = [];
  totalQuestionsArray: number[] = [];
  resultAnswers: { [key: string]: boolean }[] = [];

  get totalQuestions(): number {
    return this.questions.length;
  }

  async ngOnInit() {
    this.userData = this.authTokenService.decodeToken();
    this.email = this.userData.email;
    await this.getAllQuestions();
    this.startCountdown();
  }
  getAllQuestions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.service.findAllQuestions().subscribe({
        next: (res) => {
          this.questions = res.data;
          resolve();
        },
        error: (err) => {
          console.error('❌ Game Start error:', err);
          reject();
        },
      });
    });
  }
  getChoiceLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
  shuffleArray(array: any[]): any[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  startCountdown() {
    this.countdown = 3;
    const intervalId = setInterval(() => {
      this.zone.run(() => {
        this.countdown--;
        this.cd.detectChanges();
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
    this.questions = this.questions.map((q) => ({
      ...q,
      choices: this.shuffleArray([...q.choices]),
    }));
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

  selectAnswer(choice: string, index: number) {
    clearInterval(this.gameTimer);
    this.selectedAnswer = choice;
    const titleChoice = String.fromCharCode(65 + index);
    const questionNumber = this.questionIndex + 1;
    if (choice === this.currentQuestion.answer) {
      const gainedScore =
        (this.timeLeft / this.questionTime) * this.maxScorePerQuestion;
      // this.score += Math.round(gainedScore);
      // this.correctAnswers++;
      this.resultQuestions.push({
        id: this.currentQuestion.id,
        user_id: this.userData.uid,
        questionsNumber: questionNumber,
        questions: this.currentQuestion.question,
        titleChoice: titleChoice,
        inputAnswer: choice,
        score: Math.round(gainedScore),
        time: this.timeLeft,
      });
      // console.log(`ถูกต้อง! คุณได้ ${Math.round(gainedScore)} คะแนน`);
    } else {
      // console.log('ผิด!');
      this.resultQuestions.push({
        id: this.currentQuestion.id,
        user_id: this.userData.uid,
        questionsNumber: questionNumber,
        questions: this.currentQuestion.question,
        titleChoice: titleChoice,
        inputAnswer: choice,
        score: 0,
        time: this.timeLeft,
      });
    }

    this.nextQuestion();
  }

  async nextQuestion() {
    this.questionIndex++;
    if (this.questionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.questionIndex];
      this.timeLeft = this.questionTime;
      this.cd.detectChanges();
      this.startTimer();
    } else {
      await this.endGame();
    }
  }
  getResultStatus(index: number): boolean {
    const item = this.resultAnswers[index];
    if (!item) return false;
    const key = Object.keys(item)[0];
    return item[key] === true;
  }
  getKeys(obj: object): string[] {
    return Object.keys(obj);
  }
  async endGame() {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        this.currentQuestion = null;
        this.isGameStarted = false;
        this.service.answer({ input: this.resultQuestions }).subscribe({
          next: (res) => {
            this.resultAnswers = [...res.answerList]; // เปลี่ยน reference array
            this.score = res.score;
            this.correctAnswers = res.correct;

            this.cd.detectChanges();
            resolve(true);
          },
          error: (err) => {
            console.error('❌ Game Start error:', err);
            reject(err);
          },
        });
      });
    });
  }
  capture() {
    if (!this.captureArea) return;

    html2canvas(this.captureArea.nativeElement).then((canvas) => {
      const link = document.createElement('a');
      link.download = `cert-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  pressTimer: any;

  startPress() {
    // เริ่มจับเวลากดค้าง 800ms
    this.pressTimer = setTimeout(() => {
      this.handleLongPress();
    }, 800);
  }

  endPress() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  handleLongPress() {
    // ตัวอย่าง: เรียกฟังก์ชันบันทึกภาพ หรือ แชร์ภาพ
    this.captureAndShare();
  }

  captureAndShare() {
    const container = document.querySelector(
      '.relative.inline-block'
    ) as HTMLElement;
    if (!container) return;

    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(container).then((canvas) => {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const file = new File([blob], 'certificate.png', {
            type: 'image/png',
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator
              .share({
                files: [file],
                title: 'Certificate',
                text: 'แชร์ใบประกาศของฉัน',
              })
              .catch((err) => {
                console.error('แชร์ไม่สำเร็จ', err);
              });
          } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = 'certificate.png';
            link.click();
            URL.revokeObjectURL(link.href);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'บันทึกรูปภาพเรียบร้อย',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      });
    });
  }

  Direct(path: string) {
    this.router.navigate([path]);
  }
}
