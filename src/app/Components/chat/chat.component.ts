import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminUserId } from '../../enviroment.prod';
import { ChatService } from '../../Service/chat.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms'; 
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../Service/auth.service';
// import * as bootstrap from 'bootstrap';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent  {

  chatForm: FormGroup;
  message: string = '';
  Admin: string = AdminUserId.userId;
  userId: string = '';
  chatId: string = '';
  currentName: string = '';
  currentEmail: string = '';
  currentLastName: string = '';
  private platformId = inject(PLATFORM_ID)
  messages: any[] = [];

  constructor(
    
    private authService: AuthService,
    private chatService: ChatService,
    private fb: FormBuilder) {
      console.log('SE CREÓ CHAT COMPONENT');
      this.chatForm = this.fb.group({
        message: ['', Validators.required]
      });
    }
    
    ngOnInit(): void {
    
      this.authService.currentUser$.subscribe(user => {
        if (!user) {
          this.userId = '';  
          this.chatId = '';
          this.messages = [];
          return;
        }

        this.userId = user.id;
        this.chatId = user.id;
        this.currentEmail = user.data.email;
        this.currentName = user.data.name;
        this.currentLastName = user.data.lastName;
        this.chatService.getMessages(this.chatId).subscribe(messages => {
          this.messages = messages;
        });        
      })
    }
    
    async checkLogin() {
      const user = localStorage.getItem('user');

      if (user) {
        return;
      }
      if (this.userId) {
        return;
      }
      
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      const bootstrap = await import('bootstrap');
      
      const modalElement = document.getElementById('chatLoginModal');

      if (!modalElement) return;

      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }


  send() {
    if (!this.userId) {
      this.checkLogin();
      return;
    }

    if(this.chatForm.invalid) {
      this.chatForm.markAllAsTouched();
      return;
    }
  
    const text = this.chatForm.value.message;
    this.chatService.sendMessage(this.chatId, {
      id: this.userId,
      name: this.currentName,
      lastName: this.currentLastName,
      email: this.currentEmail
      },
      {
      user: this.userId,
      received: this.Admin,
      text: text,
      createdAt: new Date(),
      read: false
    });
     
    this.chatForm.reset();
    this.chatService.getMessages(this.chatId).subscribe(messages => {
      this.messages = messages;
    });
  }
}
