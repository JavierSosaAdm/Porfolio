import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../Service/chat.service';
// import { log } from 'console';

interface AdminChat {
  chatId: string;
  userId: string;
  userName: string;
  userLastName: string;
  email: string;
}

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [],
  templateUrl: './admin-chat.component.html',
  styleUrl: './admin-chat.component.css'
})
export class AdminChatComponent implements OnInit {
  chats: AdminChat[] = [];
  messages: any[] = [];
  selectedId: string = '';
  
  constructor(private chatService: ChatService) {
    console.log('SE CREÓ ADMIN CHAT');
  }

  ngOnInit(): void {
      this.chatService.getchats().subscribe((chats: any[]) => {
          this.chats = chats.map(chat => {
            return {
              chatId: chat.id,
              userId: chat.userId,
              userName: chat.userName,
              userLastName: chat.userLastName,
              email: chat.userEmail,
              text: chat.text
            }
          })   
          console.log('esto es chats: ', this.chats);
               
      })
  }
}
