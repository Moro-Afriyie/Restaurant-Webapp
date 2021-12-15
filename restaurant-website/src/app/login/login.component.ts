import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loginError = false;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit(): Promise<any> {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    try {
      this.loading = true;
      this.authService
        .logIn(this.loginForm.value.email, this.loginForm.value.password)
        .then((res) => {
          this.loading = false;
          this.router.navigate(['/admin']);
        })
        .catch((err) => {
          this.loginError = true;
          this.loading = false;
          setTimeout(() => {
            this.loginError = false;
          }, 5000);
        });
    } catch (error) {
      this.loading = false;
    }
  }

  onClose(): void {
    this.loginError = false;
  }
}
