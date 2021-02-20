import { Component, OnInit } from '@angular/core';
import { ApplicationSettings } from '@nativescript/core';
import { Users } from 'src/app/services/users.service';
import { GroceriesService } from '../../services/groceries.service'
import { Dialogs } from "@nativescript/core"

@Component({
  selector: 'ns-recipedetail',
  templateUrl: './recipedetail.component.html',
  styleUrls: ['./recipedetail.component.css']
})
export class RecipedetailComponent implements OnInit {
  public existsBoth:[];
  public item;
  public missing:[];

  constructor(private groceries: GroceriesService) { }

  ngOnInit(): void {
    this.existsBoth = JSON.parse(ApplicationSettings.getString('existsBoth'));
    this.item = JSON.parse(ApplicationSettings.getString('item'));//the fields inside the recipe collection in the firebase
    this.missing = JSON.parse(ApplicationSettings.getString('missing'));

  }
  addToShoppinglist(){
    Dialogs.alert({
      title: "Items been added to your shopping list!",
      message: "",
      okButtonText: "Ok"
    })
    console.log("hi")
    this.groceries.saveShoppingList(this.missing)
    console.log("hi2")
  }

}
