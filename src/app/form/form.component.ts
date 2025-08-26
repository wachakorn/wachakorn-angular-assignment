import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isSubmitting = false;
  submitMessage = '';
  isError = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.isSubmitting = true;
    this.isError = false;

    // ตรวจสอบ password และ confirmPassword
    if (this.formData.password !== this.formData.confirmPassword) {
      this.submitMessage = 'รหัสผ่านไม่ตรงกัน!';
      this.isSubmitting = false;
      this.isError = true;
      return;
    }

    // เตรียมข้อมูลที่จะส่ง (ไม่ส่ง confirmPassword)
    const payload = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      password: this.formData.password
    };

    // เรียก API
    this.http.post<any>('https://localhost:7191/ExampleOne', payload)
      .pipe(
        catchError(err => {
          this.submitMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ API';
          this.isSubmitting = false;
          this.isError = true;
          return of(null);
        })
      )
      .subscribe(res => {
        this.isSubmitting = false;
        if (res) {
          if (res.status) {
            this.submitMessage = res.message;
            this.isError = false;
            console.log('Registered User:', res.data.user);
            this.resetForm();
          } else {
            this.submitMessage = res.message;
            this.isError = true;
          }
        }
      });
  }

  resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }
}
