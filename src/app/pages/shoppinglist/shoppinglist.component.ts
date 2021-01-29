import { Component, OnInit } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service'
import { RecipesService } from '../../services/recipes.service'
import { Users } from 'src/app/services/users.service';
import { ApplicationSettings } from '@nativescript/core';
@Component({
  selector: 'ns-shoppinglist',
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.css']
})
export class ShoppinglistComponent implements OnInit {
  public user: Users;
  public ShoppingList = [];

  constructor(private groceries: GroceriesService) { }

  ngOnInit(): void {
    this.user = JSON.parse(ApplicationSettings.getString('user'));
    if (this.user.SelectedIngredients) {
      this.ShoppingList = this.user.ShoppingList
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
  }


}
