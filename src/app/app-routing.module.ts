import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { GroceriesComponent } from './pages/groceries/groceries.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { ShoppinglistComponent } from './pages/shoppinglist/shoppinglist.component';
import { RecipedetailComponent } from './pages/recipedetail/recipedetail.component';



const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "groceries", component: GroceriesComponent },
    { path: "recipes", component: RecipesComponent },
    { path: "recipedetail", component: RecipedetailComponent },
    { path: "shoppinglist", component: ShoppinglistComponent },

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
