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
  private async loadRecipes(){//פונקציה שפועלת כדי להביא מתכונים רלוונטים לפי הבחירה של המוצרים של המשתמש
    let rList = [];
    let items = this.ingredientsChosen.map(item=>item.Name)//מחפש מוצרים מתוך רשימת המוצרים המסומנים לפי השם שלהם ושם אותם בתוך אייטם
    
    await firestore.collection("Recipes").where("IngredientsArray", "array-contains-any", items)
    .get()//בודק אם קיים ברשימת מוצרים של המתכונים מוצרים מסומנים (אייטם) ומביא את המתכונים הרלוונטים
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
  something(args: ItemEventData){ //פונקציה שמביאה רשימה של המצרכים במתכון הקיימים למשתמש ברשימה שלו ורשימה של מצרכים במתכון שחסר לו
    let item = this.recipeList[args.index];
    let existsBothArray = [];//רשימה שתכיל את אותם מוצרים הקיימים במתכון וברשימה הראשית של השמתמש
    let missingIngredients=Object.assign([], item.IngredientsArray);
    console.log("I pressed ", item.Name);
    item.IngredientsArray.forEach(ingredient1 => {//לכל מוצר ברשימת מוצרים של המתכון
      this.user.SelectedIngredients.forEach(ingredient2 => {//לכל מוצר ברשימת מוצרים של המשתמש
          if (ingredient1 == ingredient2["Name"]){//אם יש להם את אותו השם
            existsBothArray.push(ingredient1)//להכניס את המוצר הזה לרשימה existbotharray
            this.ind1 = missingIngredients.indexOf(ingredient1, 0);
            missingIngredients.splice(this.ind1, 1);
            
            
          }
      })
    })
    ApplicationSettings.setString("existsBoth", JSON.stringify(existsBothArray))//רשימת המוצרים שקיימים גם במתכון וגם ברשימה של המשתמש
    ApplicationSettings.setString("item", JSON.stringify(item))//fields inside recipe collection from firebase
    ApplicationSettings.setString("missing", JSON.stringify(missingIngredients))//רשימת המוצרים שחסרים למשתמש
    
    this.router.navigate(["/recipedetail"])
  }

}
