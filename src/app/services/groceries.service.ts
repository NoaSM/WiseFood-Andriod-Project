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

  public async getList() {//מביא את הרשימת מוצרים מתוך הפיירבייס
    let Ingredients = await firestore.collection('Ingredients').get();
    return Ingredients;
  }

  public async saveSelectedIngredients(item, ind) {//פונקציה הפועלת כדי לשמור לכל משתמש את הרשימה שלו בכל שינוי שהמשתמש עושה
    let user = JSON.parse(await ApplicationSettings.getString('user'));//לוקח את המשתמש השמור ב-אפ סטינגז ומכניס לתוך משתנה
    if (ind > -1) { // רק אם האינדקס של האייטם נמצא ברשימהה, כלומר הוא גדול ממינוס 1, תבצע את כל מה שלמטה
    //אם המוצר קיים - (גדול ממינוס 1)
      if (user.SelectedIngredients) {//אם זה קיים בפיירבייס
        user.SelectedIngredients.splice(ind, 1)//תמחק את המוצר מרשימה בפיירבייס\
        
        user.SelectedIngredients.splice(ind, 0, item)//תכניס את המוצר לרשימה בפיירבייס\

      }
      else {
        user.SelectedIngredients = [item]//תיצור רשימה בפיירבייס אם הפרמטר לא קיים
      }
      

    }//אם המוצר לא קיים- הוא מוסיף (האינדקס של מוצר שלא קיים הוא מינוס 1)
    else { // אם הערך הוא מינוס 1, אז אפשר לבצע תהליל רגיל כמו לפני השינוי
      if (user.SelectedIngredients) {//אם זה קיים בפיירבייס
        user.SelectedIngredients.push(item)//תכניס את המוצר לרשימה בפיירבייס
      }
      else {
        user.SelectedIngredients = [item]//תיצור רשימה בפיירבייס אם הפרמטר לא קיים
      }
      
    }

    
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן את ה-אפ סטינגז
    
  }


  public async deleteSelectedIngredients(item) {//מחיקה של מוצרים מהפיירבייס
    let user = JSON.parse(await ApplicationSettings.getString('user'));

    for (let i = 0; i < user.SelectedIngredients.length; i++) {
      if (user.SelectedIngredients[i].ID === item.ID) {
        
        user.SelectedIngredients.splice(i, 1);//מסיר מוצר אחד מהרשימה בפיירבייס לפי האינדקס
        break;
      }
    }
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן את-אפ סטינגס בסרביס
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס

  }
  public async saveShoppingList(missing){//מעדכן את הרשימת קניות- לוקח את המוצרים החסרים מתוך המתכון
    
    let ingredients=await this.getList();
    let user = JSON.parse(await ApplicationSettings.getString('user'));
    
    let missingList=[];
    ingredients.forEach(item=>{
      let ing=item.data()
      ing.isChecked=false;
      for (let i = 0; i<missing.length; i++){
        if (ing.Name == missing[i])
          missingList.push(ing);//מקשר את המוצרים שברשימה שחסרה למשתמש למוצרים בפיירבייס
      }

    })
    if (user.ShoppingList){//אם קיים למשתמש כבר רשימת קניות והמשתמש לוחץ שוב על הוספה, שיוסיף אליה את המערך החדש
      user.ShoppingList = user.ShoppingList.concat(missingList)
    }
    else {
      user.ShoppingList = missingList//אם לא קיים רשימת קניות - שייצור שם את המערך החדש
    }
    console.log(user.ShoppingList.length)
    
    var resArr = [];
    user.ShoppingList.forEach(function(item){//עובר על כל מוצר ברשימת קניות (לולאה בתוך לולאה)
    var i = resArr.findIndex(x => x.Name == item.Name);//מחפש ברשימה החדשה אם קיים המוצר שמגיע מהרשימת קניות (מחזירה אינדקס)
     if(i <= -1){//אם היא לא מצאה כלום
      resArr.push({ID: item.ID, Name: item.Name, isChecked: item.isChecked});//מכניס את המוצר לרשימה החדשה
      }
     });
    user.ShoppingList = resArr//הרשימה החדשה מחליפה את הרשימת קניות כדי שהרשימת קניות תיהיה רשימה בלי כפילויות

    console.log(user.ShoppingList.length)
    
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן ת-אפ סטינגס בסרביס
    
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
  }


  public async updateShoppingList(item, ind){//פונקציה כדי לעדכן את הפיירבייס כדי שלא יהיו כפילויות של מוצרים(קורה בסימון מוצרים)
    let user = JSON.parse(await ApplicationSettings.getString('user'));
    if (user.ShoppingList) {//אם זה קיים בפיירבייס
      user.ShoppingList.splice(ind, 1)//תמחק את המוצר מרשימה בפיירבייס\
      
      user.ShoppingList.splice(ind, 0, item)//תכניס את המוצר לרשימה בפיירבייס\
      // ספלייס - ראשון הוא איפה לבצע את הפעולה
      // שני הוא כמה מהאיברים למחוק, אם זה אפס אז אפס איברים למחוק
      // שלישי הוא מה להכניס

    }
    else {
      user.ShoppingList = [item]//תיצור רשימה בפיירבייס אם הפרמטר לא קיים
    }
    
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן ת-אפ סטינגס בסרביס
    
    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
  }

  public async deleteShoppingList(item) {//פונקציה שמוחקת מוצר ברשימת קניות מהפיירבייס
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

  public async DelAndUp(item, ind){//פונקציה שמוחקת מוצר מהרשימת קניות ושמה את אותו המוצר ברשימה הראשית של המשתמש
    let user = JSON.parse(await ApplicationSettings.getString('user'));
    user.ShoppingList.splice(ind, 1)//מוחקים את המוצר מתוך רשימת הקניות לפי  האינדקס של המוצר
    
    let ind_2 = -1
    for (let i = 0; i < user.SelectedIngredients.length; i++) {
      if (user.SelectedIngredients[i].ID === item.ID) {//חיפוש ברשימה הראשית לפי המוצר שנבחר
        ind_2 = i//אם מצאנו מוצר- אינד2 מקבל את האינדקס של המוצר שנבחר
      }
    }
    
    item.isChecked = false
    item.exDate = ""
    if (ind_2 <= -1){//אם לא מצאנו את המוצר
      user.SelectedIngredients.push(item)//מוסיפים את המוצר לרשימה הראשית (פוש דוחף בסוף)
    }

    await firestore.collection('Users').doc(user.ID).set(user)//מעדכן את הפיירבייס
    await ApplicationSettings.setString('user', JSON.stringify(user))//מעדכן את ה-אפ סטינגז
  }

}


