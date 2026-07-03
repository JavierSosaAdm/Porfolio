import { Injectable, inject } from '@angular/core';
import { v4 as uuidV4 } from 'uuid';
import { Skill } from '../Models/skills.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { BehaviorSubject, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  
  skills: Observable<{ id:string; data: Skill}[]>;
  private skillsCollection: AngularFirestoreCollection<Skill>;
  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {
    this.skillsCollection = this.firestore.collection<Skill>('Skills');
    this.skills = this.skillsCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Skill>[]) =>
        actions.map((a) => ({
          id: a.payload.doc.id,
          data: a.payload.doc.data() as Skill
        }))
      )
    );
  }

  getSkills() {
    return this.skills;
  };

}
