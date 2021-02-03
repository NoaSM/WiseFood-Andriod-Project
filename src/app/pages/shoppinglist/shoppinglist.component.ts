import { Component, OnInit } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service'
import { RecipesService } from '../../services/recipes.service'
import { Users } from 'src/app/services/users.service';
import { ApplicationSettings } from '@nativescript/core';
import { ItemEventData } from "@nativescript/core/ui/list-view";
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


  async removeShopList(item) {
    for (let i = 0; i < this.ShoppingList.length; i++) {
      if (this.ShoppingList[i].ID === item.ID) {
    
        this.ShoppingList.splice(i, 1);
        break;
      }}
      await this.groceries.deleteShoppingList(item)
    }
      


  onSelectedTap(args: ItemEventData) {

    this.ind = args.index // האינדקס של איפה שלחצנו באפליקציה
    let item = this.ShoppingList[this.ind]
    item.isChecked = !item.isChecked
    this.groceries.updateShoppingList(item, this.ind)//פונקציה לסרביס כדי לעדכן את ה APP SETTINGS
    this.ind = -1 // לאפס את האינדקס
  }

  fromShoppingListToPantry(item){

    let ind = this.ShoppingList.indexOf(item, 0)
    this.ShoppingList.splice(ind, 1)
    this.groceries.DelAndUp(item, ind)
    // this.groceries.deleteShoppingList(item)
    // this.groceries.updatePantry(item)
  }
    // כל מני פעולות על שופינג ליסט כדי שיראו כמו שאני רוצה
    // for all items that do not look like the map that i want:
      // for all items in shopping list:
      //   name = item.name
      //   find name in ingredients and take its ID
      //   initilize shopping list as map:
      //     ID: its id
      //     Name: its name
      //     IsChecked: false
      //hi
  }



