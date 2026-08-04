import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: AngularFirestore) {}

  sendMessage(chatId: string, message: {user: string, received: string, text: string, createdAt: Date}) {

    this.firestore
      .collection('Chats')
      .doc(chatId)
      .set({
        userId: chatId,
        adminId: message.received,
        createdAt: new Date()
    }, { merge: true})

    console.log('esto es chatId: ', chatId);  
    console.log('esto es message: ', message);
    return this.firestore.collection(`chats/${chatId}/messages`).add({message})
  }

  getMessages(chatId: string) {
    console.log('esto es chatId: ', chatId);
    return this.firestore.collection(`chats/${chatId}/messages`, 
      ref => ref.orderBy('createdAt')
    ).valueChanges({ idField: 'id' })
  }
}
