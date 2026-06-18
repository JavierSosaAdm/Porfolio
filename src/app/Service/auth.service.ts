import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);

  isAdmin$ = this.isAdminSubject.asObservable();

  setIsAdmin(value: boolean) {
    this.isAdminSubject.next(value);
  }
}
