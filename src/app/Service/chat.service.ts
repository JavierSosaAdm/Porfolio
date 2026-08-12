import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AdminUserId } from '../enviroment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  

  constructor(private firestore: AngularFirestore) {}

  sendMessage(chatId: string, userInfo: {id: string, name: string, lastName: string, email: string, IsAdmin: boolean}, message: {user: string, received: string, text: string, createdAt: Date, read: boolean}) {

    this.firestore
      .collection('Chats')
      .doc(chatId)
      .set({
        userId: userInfo.IsAdmin === true? message.received : userInfo.id,
        userName: userInfo.name,
        userLastName: userInfo.lastName,
        userEmail: userInfo.email,
        adminId: AdminUserId.userId,
        IsAdmin: userInfo.IsAdmin,
        createdAt: new Date()
    }, { merge: true})
    return this.firestore.collection(`Chats/${chatId}/messages`).add({...message})
  }

  getMessages(chatId: string) {
    return this.firestore.collection(`Chats/${chatId}/messages`, 
      ref => ref.orderBy('createdAt')
    ).valueChanges({ idField: 'id' })
  }

  getchats() {
    return this.firestore.collection('Chats').valueChanges({idField: 'id'});
  }

  getChat(chatId: string) {
    return this.firestore.collection('Chats').doc(chatId).valueChanges();
  }
}
