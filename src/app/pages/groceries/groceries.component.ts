import { Component, OnInit } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service'
import { RecipesService } from '../../services/recipes.service'
//import { RecipesService } from '../../services/recipes.service'
import { SearchBar } from "@nativescript/core/ui/search-bar";
import { ItemEventData } from "@nativescript/core/ui/list-view";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { Users } from 'src/app/services/users.service';
import { ApplicationSettings } from '@nativescript/core';
import { DatePicker } from "@nativescript/core";



@Component({
  selector: 'ns-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.css']
})
export class GroceriesComponent implements OnInit {
  private DataCollection; //משתנה לשמירה של הנתונים המגיעים ממסד הנתונים
  public Ingredients = [];
  public SelectedIngredients = [];
  public searchPhrase: string = '';
  public searchBar: SearchBar;
  public NativeScriptUIListViewModule;
  public ListViewEventData;
  //public selectedItems: string;
  public dataItems: [];
  public user: Users;
  public isChecked: false;
  public ind: number = -1;
  public isCheckedArray = [];
  public minDate: Date = new Date(1975, 0, 29);
  public maxDate: Date = new Date(2045, 4, 12);
  constructor(private groceries: GroceriesService) { }

  // get SelectedItems(): string {
  //return this.selectedItems;
  //}



  ngOnInit(): void {
    this.loadIngredients();
    //this.selectedItems = "No Selected items.";
    this.user = JSON.parse(ApplicationSettings.getString('user'));
    if (this.user.SelectedIngredients) {
      this.SelectedIngredients = this.user.SelectedIngredients
    }

  }

  private async loadIngredients() {
    this.DataCollection = await this.groceries.getList(); //טוען את הרשימה ממסד הנתונים שיושב ב service
    this.DataCollection.forEach(item => {
      item.isChecked = false;
    });
  }

  private filterIngredients(text) {
    this.Ingredients = [];
    try {
      this.DataCollection.forEach(item => {
        // console.log(!this.SelectedIngredients.includes(item.data()))
        // console.log(item.data().Name.toLowerCase().indexOf(text.toLocaleLowerCase()) != -1)
        // console.log(item.data()["Name"])
        if (item.data().Name.toLowerCase().indexOf(text.toLocaleLowerCase()) != -1 && !this.SelectedIngredients.filter(items => items.Name === item.data()["Name"])[0]) //אם שם הפריט מכיל את מה שכתוב בתיבת החיפוש
          this.Ingredients.push(item.data()) //תוסיף את הפריט לרשימה המוצגת
      });
    } catch (error) {
      console.log(error)
    }
  }

  onSubmit(args) {
    this.onTextChanged(args);
  }

  onTextChanged(args) {
    this.searchBar = args.object as SearchBar;
    if (this.searchBar.text != '' || this.searchBar.text != undefined)
      this.filterIngredients(this.searchBar.text);
    else
      this.Ingredients = [];
  }

  onClear(args) {
    this.Ingredients = [];
  }

  onItemTap(args: ItemEventData) {

    let item = this.Ingredients[args.index]
    item.isChecked = false;
    this.SelectedIngredients.push(item)
    this.groceries.saveSelectedIngredients(item, this.ind)
    this.searchBar.text = '';
    this.onClear(args);

  }

  selectedTap(args: ItemEventData) {

    this.ind = args.index // האינדקס של איפה שלחצנו באפליקציה
    let item = this.SelectedIngredients[this.ind]
    item.isChecked = !item.isChecked
    this.groceries.saveSelectedIngredients(item, this.ind)//פונקציה לסרביס כדי לעדכן את ה APP SETTINGS
    this.ind = -1 // לאפס את האינדקס
  }
  //deleteItem(args:ItemEventData){
  // let item = this.SelectedIngredients[args.index]
  //item.delete().catch((error) => { alert(error); });
  //this.groceries.saveSelectedIngredients(item)
  //}

  isCheckedArrayFiller() {
    this.isCheckedArray = [] // הגדרת רשימה ריקה כל קריאה חדשה לפנקציה
    this.SelectedIngredients.forEach(items => { // מעבר על כל האייטמס שהם טרו
      if (items.isChecked == true) {
        this.isCheckedArray.push(items) // לדחוף את כל אלו שהם טרו לתוך הרשימה הריקה מהשורה הראשונה
      }
    }
    )
    //console.log(this.isCheckedArray) // להדפיס את הרשימה (רק בשבילנו, לא לשימוש אמיתי)
    ApplicationSettings.setString("CheckedIngredients", JSON.stringify(this.isCheckedArray))
  }

  async remove(item) {
    for (let i = 0; i < this.SelectedIngredients.length; i++) {
      if (this.SelectedIngredients[i].ID === item.ID) {

        this.SelectedIngredients.splice(i, 1);
        break;
      }
    }

    await this.groceries.deleteSelectedIngredients(item);
  }

  //deleteItem(args: ItemEventData) {


  //let item = this.SelectedIngredients[args.index]
  //this.SelectedIngredients.splice(item)
  //this.groceries.saveSelectedIngredients(item, this.ind)
  //
  //onItemSelected(args: ListViewEventData) {
  //const listview = args.object as RadListView;
  //const selectedItems = this.SelectedIngredients //listview.getSelectedItems() as this.SelectedIngredients;
  //let selectedTitles = "Selected items: ";
  //for (let i = 0; i < selectedItems.length; i++) {
  //selectedTitles += selectedItems[i] ? selectedItems[i].name : "";

  //if (i < selectedItems.length - 1) {
  //selectedTitles += ", ";
  //}
  //}

  //this.selectedItems = selectedTitles;
  // const selectedItem = this.filterIngredients[args.index];
  //console.log("Item selected: " + (selectedItem && selectedItem.name));
  //}
  //onItemSelecting(args: ListViewEventData) {
  //const listview = args.object as RadListView;
  //const selectedItems = this.SelectedIngredients
  // const selectedItems = listview.getSelectedItems();
  //let selectedTitles = "Selecting item: ";
  //for (let i = 0; i < selectedItems.length; i++) {
  //selectedTitles += selectedItems[i] ? selectedItems[i].name : "";

  //if (i < selectedItems.length - 1) {
  //selectedTitles += ", ";
  //}
  //}
  //const selectedItem = this.Ingredients.getItem(args.index);
  //console.log("Item selecting: " + (selectedItem && selectedItem.name));
  //const selectedItem = this.filterIngredients[args.index];
  // console.log("Item selecting: " + (selectedItem && selectedItem.name));
  // }




}

