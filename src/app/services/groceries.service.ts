import { Injectable } from '@angular/core';
import { firestore } from "@nativescript/firebase";
import { ApplicationSettings } from "@nativescript/core";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  constructor() {

  }

  public async getList() {
    let Ingredients = await firestore.collection('Ingredients').get();
    return Ingredients;
  }

  public async saveSelectedIngredients(item, ind) {//לוקח לפונקציה מוצר 
    let user = JSON.parse(await ApplicationSettings.getString('user'));//לוקח את המשתמש השמור ב-אפ סטינגז ומכניס לתוך משתנה
    if (ind > -1) { // רק אם האינדקס של האייטם נמצא ברשימהה, כלומר הוא גדול ממינוס 1, תבצע את כל מה שלמטה
      // console.log('item -=> ',item)
      // console.log('u =>', user);
      // console.log("******************")
      // console.log(item)

      // console.log(user.SelectedIngredients[ind])
      if (user.SelectedIngredients) {//אם זה קיים בפיירבייס
        user.SelectedIngredients.splice(ind, 1)//תמחק את המוצר מרשימה בפיירבייס\
        
        user.SelectedIngredients.splice(ind, 0, item)//תכניס את המוצר לרשימה בפיירבייס\
        // console.log("##################")

        // console.log(user.SelectedIngredients)
        // ספלייס - ראשון הוא איפה לבצע את הפעולה
        // שני הוא כמה מהאיברים למחוק, אם זה אפס אז אפס איברים למחוק
        // שלישי הוא מה להכניס

      }
      else {
        user.SelectedIngredients = [item]//תיצור רשימה בפיירבייס אם הפרמטר לא קיים
      }
      // console.log(user)

    }
    else { // אם הערך הוא מינוס 1, אז אפשר לבצע תהליל רגיל כמו לפני השינוי
      // console.log('item -=> ',item)
      // console.log('u =>', user);
      if (user.SelectedIngredients) {//אם זה קיים בפיירבייס
        user.SelectedIngredients.push(item)//תכניס את המוצר לרשימה בפיירבייס
      }
      else {
        user.SelectedIngredients = [item]//תיצור רשימה בפיירבייס אם הפרמטר לא קיים
      }
      // console.log(user)
    }

    // console.log("1")
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן את ה-אפ סטינגז
    // console.log("2")
  }


  public async deleteSelectedIngredients(item) {
    let user = JSON.parse(await ApplicationSettings.getString('user'));

    for (let i = 0; i < user.SelectedIngredients.length; i++) {
      if (user.SelectedIngredients[i].ID === item.ID) {
        
        user.SelectedIngredients.splice(i, 1);
        break;
      }
    }
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן ת-אפ סטינגס בסרביס
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס

  }
  public async saveShoppingList(missing){
    //console.log(missing)
    let ingredients=await this.getList();
    let user = JSON.parse(await ApplicationSettings.getString('user'));
    //console.log("hi4")
    let missingList=[];
    ingredients.forEach(item=>{
      let ing=item.data()
      ing.isChecked=false;
      for (let i = 0; i<missing.length; i++){
        if (ing.Name == missing[i])
          missingList.push(ing);
      }

    })
    if (user.ShoppingList){
      user.ShoppingList = user.ShoppingList.concat(missingList)
    }
    else {
      user.ShoppingList = missingList
    }
    console.log(user.ShoppingList.length)
    // let TempList = Array.from(new Set(user.ShoppingList)); 
    // user.ShoppingList = TempList
    var resArr = [];
    user.ShoppingList.forEach(function(item){
    var i = resArr.findIndex(x => x.Name == item.Name);
     if(i <= -1){
      resArr.push({ID: item.ID, Name: item.Name, isChecked: item.isChecked});
      }
     });
    user.ShoppingList = resArr

    console.log(user.ShoppingList.length)
    //console.log("hi5")
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן ת-אפ סטינגס בסרביס
    //console.log("hi6")
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
  }


  public async updateShoppingList(item, ind){
    let user = JSON.parse(await ApplicationSettings.getString('user'));
    if (user.ShoppingList) {//אם זה קיים בפיירבייס
      user.ShoppingList.splice(ind, 1)//תמחק את המוצר מרשימה בפיירבייס\
      
      user.ShoppingList.splice(ind, 0, item)//תכניס את המוצר לרשימה בפיירבייס\
      // console.log("##################")

      // console.log(user.SelectedIngredients)
      // ספלייס - ראשון הוא איפה לבצע את הפעולה
      // שני הוא כמה מהאיברים למחוק, אם זה אפס אז אפס איברים למחוק
      // שלישי הוא מה להכניס

    }
    else {
      user.ShoppingList = [item]//תיצור רשימה בפיירבייס אם הפרמטר לא קיים
    }
    //console.log("hi5")
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן ת-אפ סטינגס בסרביס
    //console.log("hi6")
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
  }

  public async deleteShoppingList(item) {
    let user = JSON.parse(await ApplicationSettings.getString('user'));

    for (let i = 0; i < user.ShoppingList.length; i++) {
      if (user.ShoppingList[i].ID === item.ID) {
        
        user.ShoppingList.splice(i, 1);
        break;
      }
    }
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן ת-אפ סטינגס בסרביס
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס

  }

  public async DelAndUp(item, ind){
    let user = JSON.parse(await ApplicationSettings.getString('user'));
    user.ShoppingList.splice(ind, 1)
    let ind_2 = user.SelectedIngredients.indexOf(item, 0)
    item.isChecked = false
    item.exDate = ""
    if (ind_2 <= -1){
      user.SelectedIngredients.push(item)
    }

    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן את ה-אפ סטינגז
  }

  // public async updatePantry(item) {
  //   let user = JSON.parse(await ApplicationSettings.getString('user'));

  //   for (let i = 0; i < user.SelectedIngredients.length; i++) {
  //     if (user.SelectedIngredients[i].ID === item.ID) {
  //       console.log('if entered')
  //       return;
  //     }
  //   }
  //   console.log('else entered')
  //   // item.isChecked = false
  //   user.SelectedIngredients.push(item)
  //   // user.SelectedIngredients[user.SelectedIngredients.length - 1].isChecked =false
      
    
  //   console.log('awaits')
  //   await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן ת-אפ סטינגס בסרביס
  //   await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
  // }

  
  //public async whenToggleCheck(item){
  //console.log('item -=> ',item)

  //let user = JSON.parse(await ApplicationSettings.getString('user'));
  //console.log('u =>', user);


  //await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
  //await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן את ה-אפ סטינגז
  //}



}


