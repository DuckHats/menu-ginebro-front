import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../Services/Auth/auth.service';
import { UserService } from '../../Services/User/user.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jasmine.createSpy('login'),
    checkIfAdmin: jasmine.createSpy('checkIfAdmin'),
  } as unknown as AuthService;

  const mockUserService = {
    me: jasmine.createSpy('me'),
  } as unknown as UserService;

  const mockAlertService = {
    show: jasmine.createSpy('show'),
  } as unknown as AlertService;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
  } as unknown as Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
    // reset spies
    (mockAuthService.login as jasmine.Spy).calls.reset();
    (mockAuthService.checkIfAdmin as jasmine.Spy).calls.reset();
    (mockUserService.me as jasmine.Spy).calls.reset();
    (mockAlertService.show as jasmine.Spy).calls.reset();
    (mockRouter.navigate as jasmine.Spy).calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not store a JWT token on successful login and fetches user via session', fakeAsync(() => {
    // Arrange: auth.login resolves with 200 and no token (session cookie flow)
    (mockAuthService.login as jasmine.Spy).and.returnValue(of({ status: 200 }));
    (mockUserService.me as jasmine.Spy).and.returnValue(of({ id: 1, name: 'Test' }));
    (mockAuthService.checkIfAdmin as jasmine.Spy).and.returnValue(of(false));

    // Fill form
    component.loginForm.setValue({ user: 'test@example.com', password: 'pass' });

    // Act
    component.onSubmit();
    tick();

    // Assert: no token set in localStorage
    expect(localStorage.getItem('token')).toBeNull();
    // userService.me should have been called to populate the session user
    expect(mockUserService.me).toHaveBeenCalled();
    // Router navigated to HOME
    expect(mockRouter.navigate).toHaveBeenCalled();
  }));
});
