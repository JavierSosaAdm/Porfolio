import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, from, map, Observable, take } from 'rxjs';
import { User } from '../Models/user.model';
import { v4 as uuidV4 } from 'uuid';


@Injectable({
    providedIn: 'root'
})

export class UserService {
  
  users: Observable<{ id: string; data: User }[]>;
  private userLogSubject = new BehaviorSubject<boolean>(false);
  private _http = inject(HttpClient);
  private UserCollection: AngularFirestoreCollection<User>;
  userLog$ = this.userLogSubject.asObservable();

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {

    this.UserCollection =
      this.firestore.collection<User>('User');

    this.users =
      this.UserCollection.snapshotChanges().pipe(
        map((actions: DocumentChangeAction<User>[]) =>
          actions.map((a) => ({
            id: a.payload.doc.id,
            data: a.payload.doc.data() as User
          }))
        )
      );
  }

  getUser(): Observable<{ id: string; data: User }[]> {
    this.userLogSubject.next(true);
    console.log('users: ', this.users);
    
    return this.users;
  }
  
  logout() {
    this.userLogSubject.next(false);
  }

  postUser(user: User) {
    return from(
      this.firestore
        .collection('User')
        .doc(uuidV4())
        .set(user)
    );
  }

  getUserByEmail(email: string): Observable<{ id: string, data: User } | null> {
      console.log('esto es email: ',email);
      
      return this.users.pipe(take(1), map(users => {
        const user = users.find(
          user => user.data.email === email
        )
        console.log('esto es user de getByemial: ', user);
        
        return user || null;
      })) 
  }
}


