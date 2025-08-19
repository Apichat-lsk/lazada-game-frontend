import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { OtpService } from '../../services/otp-service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service';
import { ContactService } from '../../services/contact-service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm!: FormGroup;
  isMatched = false;
  showPassword = false;
  registerFlak = false;
  constructor(
    private otp: OtpService,
    private contact: ContactService,
    private router: Router,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.location.replaceState('');
    this.contactForm = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z\s]+$/),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z\s]+$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
  ngOnInit() {
    this.contactForm.valueChanges.subscribe(() => {
      this.isMatched =
        !!this.contactForm.get('email')?.valid &&
        !!this.contactForm.get('title')?.valid &&
        !!this.contactForm.get('description')?.valid;
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contact.create(this.contactForm.value).subscribe({
        next: (res) => {
          if (!res) {
          }
        },
        error: (err) => {
          console.error('❌ Game Start error:', err);
        },
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/index']);
  }
}
