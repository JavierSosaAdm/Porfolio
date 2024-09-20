import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, Observable } from 'rxjs';
import { Repository } from '../Models/repositories.model';
import { Information } from '../Models/information.model';
import { doc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  repositories: Observable<{id: string, data: Repository}[]>;
  private _http = inject(HttpClient);
  private RepoCollection: any;


  constructor (storage: AngularFireStorage, firestore: AngularFirestore) {
    storage = storage;
    firestore = firestore;
    this.RepoCollection = firestore.collection<Repository>('Repositories')
    this.repositories = this.RepoCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Repository>[]) => {
        actions.map((a) => {
          const { payload } = a;
          const data = payload.doc.data() as Repository;
          const id = payload.doc.id;
          return { id, data };
        })
      })
    )
  }
  getRepositories(): Observable<{id: string, data: Repository}[]> {
    // console.log('esto es data: );
    return this.repositories
    
  }
}
