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
  currentAdmin: boolean = false;
  private platformId = inject(PLATFORM_ID)
  messages: any[] = [];
  selectedChat: any = null;
  chats: any[] = [];

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
          this.chats = [];
          this.selectedChat = null;
          return;
        }
        this.userId = user.id;
        this.currentEmail = user.data.email;
        this.currentName = user.data.name;
        this.currentLastName = user.data.lastName;
        this.currentAdmin = user.data.IsAdmin;
        
        if (this.currentAdmin === false) {
          this.chatId = user.id;
          this.chatService.getMessages(this.chatId).subscribe(messages => {
            this.messages = messages;
          });        
        }
        
        if (this.currentAdmin === true) {
          this.chatService.getchats().subscribe(chats => {
            this.chats = chats;
          })
        };
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
      const bootstrap = (window as any).bootstrap;

      if (bootstrap) {

        const modalElement = document.getElementById('chatLoginModal');
  
        if (!modalElement) return;
  
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
      }
    }

  selectChat(chat: any) {
    this.selectedChat = chat;
    this.chatId = chat.id;

    this.chatService.getMessages(this.chatId).subscribe(messages => {
      this.messages = messages
    })
  };

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

    if (!text) {
      return;
    }


    if(this.currentAdmin === false) {
      this.chatService.sendMessage(this.chatId, {
        id: this.userId,
        name: this.currentName,
        lastName: this.currentLastName,
        email: this.currentEmail,
        IsAdmin: this.currentAdmin
        },
        {
        user: this.userId,
        received: this.Admin,
        text: text,
        createdAt: new Date(),
        read: false
      });
    }

    if(this.currentAdmin === true) {
      this.chatService.sendMessage(this.chatId, {
        id: this.userId,
        name: this.currentName,
        lastName: this.currentLastName,
        email: this.currentEmail,
        IsAdmin: this.currentAdmin
        },
        {
        user: this.Admin,
        received: this.chatId,
        text: text,
        createdAt: new Date(),
        read: false
      });
    }
     
    this.chatForm.reset();
  }
}
