// import { Injectable } from '@angular/core';
// import {
//   AngularFireDatabase,
//   AngularFireObject,
// } from '@angular/fire/compat/database';
// import { AppUser } from '../models/app-user';
// import { Observable, take, switchMap, map } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   //acheive Authorization
//   constructor(private db: AngularFireDatabase) {}

//   save(user: AppUser) {
//     if (user)
//       this.db.object('/users/' + user.uid).update({
//         name: user.displayName,
//         email: user.email,
//       });
//   }

//   get(uid: string): Observable<AppUser> {
//     return this.db.object<AppUser>('/users/' + uid).valueChanges();
//   }

//   isUserExist(email: string): Promise<boolean> {
//     return new Promise<boolean>((resolve) => {
//       this.db
//         .list('/users')
//         .valueChanges()
//         .pipe(
//           take(1),
//           map((users: any[]) => {
//             return users.some((user) => user?.email === email);
//           })
//         )
//         .subscribe((isExists) => {
//           resolve(isExists);
//         });
//     });
//   }
//   // return this.db.object<AppUser>('/users/' + uid).valueChanges();
// }
