import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";
import { NativeScriptFormsModule } from "@nativescript/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { GroceriesComponent } from './pages/groceries/groceries.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { ShoppinglistComponent } from './pages/shoppinglist/shoppinglist.component';
import { RecipedetailComponent } from './pages/recipedetail/recipedetail.component';


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        GroceriesComponent,
        RecipesComponent,
        ShoppinglistComponent,
        RecipedetailComponent

    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
