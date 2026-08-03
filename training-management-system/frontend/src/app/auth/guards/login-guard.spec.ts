import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginGuard } from './login-guard';
import { AuthService } from '../services/auth';

describe('LoginGuard', () => {
  let guard: LoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => false,
            getRole: () => 'admin'
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: ()=>{}
          }
        }
      ]
    });

    guard = TestBed.inject(LoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});