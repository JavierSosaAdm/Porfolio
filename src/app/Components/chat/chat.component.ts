import { Component, inject, OnInit } from '@angular/core';
import { AdminUserId } from '../../enviroment.prod';
import { ChatService } from '../../Service/chat.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms'; 
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../Service/auth.service';


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

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private fb: FormBuilder) {
      this.chatForm = this.fb.group({
        message: ['', Validators.required]
      });
    console.log('esto es chatForm: ', this.chatForm);
    }
    
    ngOnInit(): void {
    
      this.authService.currentUser$.subscribe(user => {
        if (!user) {
          this.userId = '';  
          this.chatId = '';
          return;
        }

        this.userId = user.id;
        this.chatId = user.id;
        console.log('Usuario actual: ', this.userId)
      })
    }
    
    checkLogin() {
      const user = localStorage.getItem('user');

      if (user) {
        return;
      }

      const modal = document.getElementById('chatLoginModal');

      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        modal.removeAttribute('aria-hidden');

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';

        document.body.appendChild(backdrop);
        document.body.classList.add('modal-open');
      }
    }


  send() {
    if (!this.userId) {
      this.checkLogin();
      return;
    }

    if(this.chatForm.invalid) {
      console.log('mensaje no enviado');
      this.chatForm.markAllAsTouched();
      return;
    }
  
    const text = this.chatForm.value.message;
    console.log('esto es texto: ', text);
    this.chatService.sendMessage(this.chatId, {
      user: this.userId,
      received: this.Admin,
      text: text,
      createdAt: new Date()
    });
    // console.log('mensaje enviado:');
    this.chatForm.reset();
  }
}
