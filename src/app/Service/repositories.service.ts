import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from, map, Observable } from 'rxjs';
import { Repository } from '../Models/repositories.model';
import { Information } from '../Models/information.model';
import { doc } from 'firebase/firestore';
import { v4 as uuidV4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  repositories: Observable<{id: string, data: Repository}[]>;
  private _http = inject(HttpClient);
  private firestore: AngularFirestore;
  private RepoCollection: AngularFirestoreCollection<Repository>;

  constructor (storage: AngularFireStorage, firestore: AngularFirestore) {
    storage = storage;
    this.firestore = firestore;
    this.RepoCollection = firestore.collection<Repository>('Repositories')
    this.repositories = this.RepoCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Repository>[]) =>
        actions.map((a) => ({ id: a.payload.doc.id, data: a.payload.doc.data() as Repository }))
      )
    )
  }
  
  
  getRepositories(): Observable<{id: string, data: Repository}[]> {
    return this.repositories
  }

  postRepositories(repository: Repository) {
    return from(this.firestore.collection('Repositories').doc(uuidV4()).set(repository))
  }
}
