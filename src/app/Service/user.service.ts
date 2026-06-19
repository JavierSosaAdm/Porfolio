import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
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
}


