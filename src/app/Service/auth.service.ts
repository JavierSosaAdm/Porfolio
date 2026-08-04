import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Models/user.model';

export interface LoggerUser {
  id: string;
  data: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private userLogSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<LoggerUser | null>(null);  
  
  isAdmin$ = this.isAdminSubject.asObservable();
  userLog$ = this.userLogSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const user = localStorage.getItem('user')
    console.log('Usuario almacenado:', user);

    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.userLogSubject.next(true);

      const currentUser = JSON.parse(user);
      console.log('Restaurando usuario:', currentUser);
      this.isAdminSubject.next(currentUser.data.IsAdmin);
    }
  }

  setIsAdmin(value: boolean) {
    this.isAdminSubject.next(value);
  }
  
  setCurrentUser(user: LoggerUser | null) {
    this.currentUserSubject.next(user);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userLogSubject.next(true);
      this.isAdminSubject.next(user.data.IsAdmin);
    }
  }

  login() {
    this.userLogSubject.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.setIsAdmin(false);
    this.userLogSubject.next(false);
  }
}
