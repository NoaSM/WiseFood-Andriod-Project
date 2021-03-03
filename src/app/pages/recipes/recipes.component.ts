import { Component, OnInit } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service'
import { RecipesService } from '../../services/recipes.service'
import { Users } from 'src/app/services/users.service';
import { ApplicationSettings, ItemEventData } from '@nativescript/core';
import { firestore } from "@nativescript/firebase";
import { Router,NavigationEnd } from '@angular/router';



@Component({
  selector: 'ns-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  
  public ingredientsChosen;
  public recipeList = [];
  
  public user: Users;
  public ind1;
  
 // public CheckedIngredients:[];

  constructor(private groceries: GroceriesService, private recipes: RecipesService,  private router: Router)  {
   }

  ngOnInit(): void {

    this.ingredientsChosen = JSON.parse(ApplicationSettings.getString('CheckedIngredients'));
    this.loadRecipes();
    this.user = JSON.parse(ApplicationSettings.getString('user'));
    
  }
  private async loadRecipes(){
    let rList = [];
    let items = this.ingredientsChosen.map(item=>item.Name)//searching for the checked ingredients by name
    
    await firestore.collection("Recipes").where("IngredientsArray", "array-contains-any", items)
    .get()//checks if ingredients inside the recipe collection contains any of the checked ingredients and gets the relevent recipes
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
             let r = doc.data() //is never undefined for query doc snapshots
          
          rList.push(r)
        });
    })
  .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
    this.recipeList = [...rList];//מפשט לאוביקט push the relevent recipes into a new array - recipelist
    
  }
  something(args: ItemEventData){ //item comes from recipes html ngfor which contains the fields of the recipe collection
    let item = this.recipeList[args.index];
    let existsBothArray = [];//a new array that will contain the ingredients that exists in both the relevent recipe to the user and the user's selected ingredients
    let missingIngredients=Object.assign([], item.IngredientsArray);
    console.log("I pressed ", item.Name);
    item.IngredientsArray.forEach(ingredient1 => {//every ingredient in the recipe (IngredientsArray field)
      this.user.SelectedIngredients.forEach(ingredient2 => {//every ingredient in the user's selected ingredients list
          if (ingredient1 == ingredient2["Name"]){//if they share the same name, push into a new list
            existsBothArray.push(ingredient1)
            this.ind1 = missingIngredients.indexOf(ingredient1, 0);
            missingIngredients.splice(this.ind1, 1);
            
            
          }
      })
    })
    ApplicationSettings.setString("existsBoth", JSON.stringify(existsBothArray))//selected ingredients + ingredients in recipe
    ApplicationSettings.setString("item", JSON.stringify(item))//fields inside recipe collection from firebase
    ApplicationSettings.setString("missing", JSON.stringify(missingIngredients))
    
    this.router.navigate(["/recipedetail"])
  }

}
