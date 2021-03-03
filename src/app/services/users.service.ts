import { Injectable } from '@angular/core';

import { firebase, firestore } from "@nativescript/firebase";
import { auth } from "@nativescript/firebase/app";
import { ApplicationSettings } from "@nativescript/core";
import { Router } from "@angular/router";
import { NgZone } from '@angular/core';

export class Users {
  Email: string;
  ID: string;
  Password: string;
  Username: string;
  SelectedIngredients: [];
  ShoppingList: [];



}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private router: Router, private zone: NgZone) { }


  public async addUser(user: Users) {


    auth().createUserWithEmailAndPassword(user.Email, user.Password)
      .then(async (data) => {
        let Users = await firestore.collection('Users');
        user.ID = data.uid;
        Users.doc(data.uid).set(user);
        console.log("User logged in")
        this.zone.run(() => {
          this.router.navigate(['/login']);
        });
        
      })
      .catch(err => console.log("Login error: " + JSON.stringify(err)));

  }

  public async loginUser(user: Users) {
    auth().signInWithEmailAndPassword(user.Email, user.Password)
      .then(async (data) => {
        let UserDoc = await (await firestore.collection('Users').doc(data.user.uid).get()).data();
        await ApplicationSettings.setString('user', JSON.stringify(UserDoc))
        this.zone.run(() => {
          this.router.navigate(['/groceries']);
        });
        
      })
      .catch(err => console.log("Login error: " + JSON.stringify(err)));
  }

}