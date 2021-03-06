import { Component, OnInit } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service'
import { RecipesService } from '../../services/recipes.service'
import { Users } from 'src/app/services/users.service';
import { ApplicationSettings } from '@nativescript/core';
import { ItemEventData } from "@nativescript/core/ui/list-view";
import { Dialogs } from "@nativescript/core"
@Component({
  selector: 'ns-shoppinglist',
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.css']
})
export class ShoppinglistComponent implements OnInit {
  public user: Users;
  public ShoppingList = [];
  public ind: number = -1;
  public NativeScriptUIListViewModule;
  public ListViewEventData;

  constructor(private groceries: GroceriesService) { }

  ngOnInit(): void {
    this.user = JSON.parse(ApplicationSettings.getString('user'));
    if (this.user.SelectedIngredients) {
      this.ShoppingList = this.user.ShoppingList
    }

      }


  async removeShopList(item) {//מוחק מוצר מהרשימת קניות
    for (let i = 0; i < this.ShoppingList.length; i++) {
      if (this.ShoppingList[i].ID === item.ID) {//רץ על אורך הרשימה ומוצא את המוצר הנבחר למחיקה לפי ID
    
        this.ShoppingList.splice(i, 1);//מחיקת מוצר מהמסך
        break;
      }}
      await this.groceries.deleteShoppingList(item)//מפעיל פונקיית מחיקה בשרת ומעדכן את הפיירבייס
    }
      


  onSelectedTap(args: ItemEventData) {//מסמן מוצר ברשימת קניות

    this.ind = args.index // האינדקס של איפה שלחצנו באפליקציה
    let item = this.ShoppingList[this.ind]
    item.isChecked = !item.isChecked
    this.groceries.updateShoppingList(item, this.ind)//פונקציה לסרביס כדי לעדכן את ה APP SETTINGS
    this.ind = -1 // לאפס את האינדקס
  }

  fromShoppingListToPantry(item){//מעביר מוצר מהרשימת קניות לרשימה הראשית
    Dialogs.alert({
      title: "The Item Has Moved To Your Pantry List",
      message: "",
      okButtonText: "Ok"
    })
    let ind = this.ShoppingList.indexOf(item, 0)
    this.ShoppingList.splice(ind, 1)
    this.groceries.DelAndUp(item, ind)
    
  }
  
  }



