import { Injectable } from '@angular/core';
import { firestore } from "@nativescript/firebase";


@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor() { 

  }
  public async getList(){
    let Recipes = await firestore.collection('Recipes').get();
    return Recipes;
  }
}
