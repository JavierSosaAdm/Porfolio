import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private userLogSubject = new BehaviorSubject<boolean>(false)  

  isAdmin$ = this.isAdminSubject.asObservable();
  userLog$ = this.userLogSubject.asObservable();

  setIsAdmin(value: boolean) {
    this.isAdminSubject.next(value);
  }

  login() {
    this.userLogSubject.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    this.setIsAdmin(false);
    this.userLogSubject.next(false);
  }
}
