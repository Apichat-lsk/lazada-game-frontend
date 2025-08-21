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
  fullName = '';
  countdown = 5;
  countdownImg: any[] = [
    '/assets/images/game/Num5.png',
    '/assets/images/game/Num4.png',
    '/assets/images/game/Num3.png',
    '/assets/images/game/Num2.png',
    '/assets/images/game/Num1.png',
  ];
  isGameStarted = false;
  currentDate = new Date();
  certDate = new Date();
  questionIndex = 0;
  currentQuestion: any = null;
  questionTime = 10;
  timeLeft = this.questionTime;
  gameTimer: any;
  selectedAnswer: string | null = null;
  score = 0;
  choice: string = '';
  titleChoice = '';
  maxScorePerQuestion = 100;
  correctAnswers = 0;
  questions: any[] = [];
  resultQuestions: any[] = [];
  totalQuestionsArray: number[] = [];
  resultAnswers: { [key: string]: boolean }[] = [];
  isGameEnded = false;
  audio = new Audio();
  showNextButton = false;
  isAnswerConfirmed = false;
  checkAnswerByQuestions = {};
  answerCorrect: string = '';
  result = this.genDateTime();

  get totalQuestions(): number {
    return this.questions.length;
  }

  async ngOnInit() {
    this.userData = this.authTokenService.decodeToken();
    this.fullName = this.userData.full_name;
    this.email = this.userData.email;
    await this.getAllQuestions();
    this.startCountdown();
  }
  getAllQuestions(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.service.findAllQuestions().subscribe({
        next: (res) => {
          if (res.data.length) {
            this.questions = res.data;
            resolve();
          }
        },
        error: (err) => {
          console.error('❌ Game Start error:', err);
          reject();
        },
      });
    });
  }
  genDateTime() {
    this.certDate = new Date();
    const hours = String(this.certDate.getHours()).padStart(2, '0');
    const minutes = String(this.certDate.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    const day = String(this.certDate.getDate()).padStart(2, '0');
    const month = String(this.certDate.getMonth() + 1).padStart(2, '0');
    const year = this.certDate.getFullYear();
    const date = `${day}/${month}/${year}`;

    // คืนค่าเป็น object
    return { date, time };
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
    this.countdown = 5;
    // const audio = new Audio();
    // audio.src = 'assets/sounds/count-down.mp3';
    // audio.load();
    // audio.play().catch((err) => {
    //   console.warn('Unable to play sound:', err);
    // });
    const intervalId = setInterval(() => {
      this.zone.run(() => {
        this.countdown--;
        this.cd.detectChanges();
        if (this.countdown <= 0) {
          // audio.pause();
          clearInterval(intervalId);
          this.startGame();
        }
      });
    }, 1200);
  }

  startGame() {
    // this.playSoundGame('assets/sounds/game-play.mp3');
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
  playSoundGame(src: string) {
    this.audio.src = src;
    this.audio.load();
    this.audio.play().catch((err) => {
      console.warn('Unable to play sound:', err);
    });
  }
  playSoundSelectAnswer(src: string) {
    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play().catch((err) => {
      console.warn('Unable to play sound:', err);
    });
  }
  playSoundCountDown(src: string) {
    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play().catch((err) => {
      console.warn('Unable to play sound:', err);
    });
  }
  selectAnswer(choice: string, index: number) {
    // ถ้ายืนยันคำตอบแล้ว หรือเกมจบแล้ว ให้ return
    if (this.isAnswerConfirmed || this.isGameEnded) return;

    this.playSoundSelectAnswer('assets/sounds/pop.mp3');
    clearInterval(this.gameTimer);

    this.selectedAnswer = choice;

    const questionNumber = this.questionIndex + 1;
    const titleChoice = String.fromCharCode(65 + index);
    this.choice = choice; // เก็บคำตอบที่เลือกไว้
    // const gainedScore =
    //   choice === this.currentQuestion.answer
    //     ? (this.timeLeft / this.questionTime) * this.maxScorePerQuestion
    //     : 0;

    const existingIndex = this.resultQuestions.findIndex(
      (q) => q.questionsNumber === questionNumber
    );

    const answerObj = {
      id: this.currentQuestion.id,
      user_id: this.userData.uid,
      questionsNumber: questionNumber,
      questions: this.currentQuestion.question,
      titleChoice: titleChoice,
      inputAnswer: choice,
      // score: Math.round(gainedScore),
      score: 0,
      time: this.timeLeft,
    };
    this.checkAnswerByQuestions = answerObj;
    if (existingIndex !== -1) {
      this.resultQuestions[existingIndex] = answerObj;
    } else {
      this.resultQuestions.push(answerObj);
    }

    this.cd.detectChanges();
  }

  startTimer() {
    if (this.gameTimer) clearInterval(this.gameTimer);

    this.gameTimer = setInterval(() => {
      this.zone.run(() => {
        this.timeLeft--;
        this.cd.detectChanges();

        if (this.timeLeft <= 0) {
          clearInterval(this.gameTimer);

          // ถ้าไม่เลือกคำตอบ
          if (!this.selectedAnswer && this.currentQuestion) {
            const questionNumber = this.questionIndex + 1;
            this.checkAnswerByQuestions = {
              id: this.currentQuestion.id,
              user_id: this.userData.uid,
              questionsNumber: questionNumber,
              questions: this.currentQuestion.question,
              titleChoice: '', // ไม่มีการเลือก
              inputAnswer: '', // ไม่มีการเลือก
              score: 0, // ได้ 0 คะแนน
              time: 0, // เวลา 0
            };
            this.resultQuestions.push({
              id: this.currentQuestion.id,
              user_id: this.userData.uid,
              questionsNumber: questionNumber,
              questions: this.currentQuestion.question,
              titleChoice: '', // ไม่มีการเลือก
              inputAnswer: '', // ไม่มีการเลือก
              score: 0, // ได้ 0 คะแนน
              time: 0, // เวลา 0
            });
          }

          this.selectedAnswer = null;
          this.showNextButton = true; // แสดงปุ่มข้อต่อไป
          this.cd.detectChanges();
        }
      });
    }, 1000);
  }

  nextQuestion() {
    this.showNextButton = false;
    this.selectedAnswer = null;
    this.isAnswerConfirmed = false; // รีเซ็ตล็อกคำตอบ
    this.cd.detectChanges();

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
  checkAnswer() {
    if (!this.selectedAnswer) return; // ถ้ายังไม่ได้เลือกคำตอบ
    this.isAnswerConfirmed = true; // ล็อกคำตอบ
    this.showNextButton = true;
    this.cd.detectChanges();

    // หยุด timer
    if (this.gameTimer) clearInterval(this.gameTimer);

    return new Promise((resolve, reject) => {
      this.service.checkAnswer(this.checkAnswerByQuestions).subscribe({
        next: (res) => {
          this.answerCorrect = res.answer;
          const gainedScore =
            this.choice === res.answer
              ? (this.timeLeft / this.questionTime) * this.maxScorePerQuestion
              : 0;
          this.resultQuestions[this.questionIndex].score =
            Math.round(gainedScore);
          this.cd.detectChanges();
          resolve(true);
        },
        error: (err) => {
          console.error('❌ Game Start error:', err);
          reject(err);
        },
      });
    });
  }
  getResultStatus(index: number): boolean {
    const item = this.resultAnswers[index];
    if (!item) return false;
    const key = Object.keys(item)[0];
    return item[key] === true;
  }
  getValue(index: number): string {
    const item = this.resultAnswers[index];
    if (!item) return '';
    const key = Object.keys(item)[0];
    return key;
  }

  async endGame() {
    this.timeLeft = this.questionTime;
    this.audio.pause();
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
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
    if (!this.captureArea) return;

    html2canvas(this.captureArea.nativeElement).then((canvas) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'certificate.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator
            .share({
              files: [file],
              title: 'Certificate',
              text: 'แชร์ใบประกาศของฉัน',
            })
            .catch((err) => console.error('แชร์ไม่สำเร็จ', err));
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
  }

  Direct(path: string) {
    this.router.navigate([path]);
  }
}
