import { Component, OnInit } from '@angular/core';
import { ApplicationSettings } from '@nativescript/core';
import { Users } from 'src/app/services/users.service';
import { GroceriesService } from '../../services/groceries.service'

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
    console.log("hi")
    this.groceries.saveShoppingList(this.missing)
    console.log("hi2")
  }

}
