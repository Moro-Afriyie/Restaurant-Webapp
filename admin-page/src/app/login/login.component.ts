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
    console.log(this.loginForm.value);

    if (this.loginForm.invalid) {
      return;
    }

    try {
      this.authService
        .logIn(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          console.log('success');
          this.router.navigate(['/']);
        })
        .catch((err) => {
          console.log(err);
          this.loginError = true;
          setTimeout(() => {
            this.loginError = false;
          }, 5000);
        });
    } catch (error) {
      console.log(error);
    }
  }

  onClose(): void {
    this.loginError = false;
  }
}
