import { Component, OnInit, ɵɵNgOnChangesFeature, AfterViewInit, OnChanges } from '@angular/core';
import { GroceriesService } from '../../services/groceries.service'
import { RecipesService } from '../../services/recipes.service'
//import { RecipesService } from '../../services/recipes.service'
import { SearchBar } from "@nativescript/core/ui/search-bar";
import { ItemEventData } from "@nativescript/core/ui/list-view";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { Users } from 'src/app/services/users.service';
import { ApplicationSettings, ObservableArray } from '@nativescript/core';
import { DatePicker } from "@nativescript/core";
import { Dialogs } from "@nativescript/core"
import { Router,NavigationEnd } from '@angular/router';




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
  constructor(private groceries: GroceriesService,
    private router: Router
 ) {
    this.router.events.subscribe((e) => { //פונקציה שעושה ריפרש לדף כל פעם שמגיעים אליו
        if (e instanceof NavigationEnd) {
            // Function you want to call here
            this.user = JSON.parse(ApplicationSettings.getString('user'));
            this.SelectedIngredients = this.user.SelectedIngredients
              console.log('const')
        
            this.refreshDate();
        }
     });
 }
  
  

  // get SelectedItems(): string {
  //return this.selectedItems;
  //}



  ngOnInit(): void {
    this.pageLoad();


  }
  private pageLoad(){//פונקציה שקורת בפעם הראשונה שנכנסים לדף
    console.log('run')
    this.loadIngredients();
    //this.selectedItems = "No Selected items.";
    this.user = JSON.parse(ApplicationSettings.getString('user'));//לוקח את הלוקר סטורג' של המשתמש מתוך הסרביס של המשתמש
    if (this.user.SelectedIngredients) {
      this.SelectedIngredients = this.user.SelectedIngredients//מקשר ואומר שכל מה שבסלקטד יהיה קשור לסלקטד של המשתמש
      // console.log(this.SelectedIngredients)

      this.refreshDate();//פונקציה שעוזרת לתאריך להתדעכן באופן יומיומי
     

    }
  }


  private async loadIngredients() {
    this.DataCollection = await this.groceries.getList(); //טוען את הרשימה ממסד הנתונים שיושב ב service
    this.DataCollection.forEach(item => {
      item.isChecked = false;//קובע שהמצב הראשוני לכל מוצר יהיה FALSE
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

  onTextChanged(args) { //כהשמתמש מתחיל לרשום בחיפוש , הפונקציה של הפילטר עובדת
    this.searchBar = args.object as SearchBar;
    if (this.searchBar.text != '' || this.searchBar.text != undefined)
      this.filterIngredients(this.searchBar.text);
    else
      this.Ingredients = [];
  }

  onClear(args) {
    this.Ingredients = []; 
  }

  onItemTap(args: ItemEventData) {//פונקציה שקורת כהשמתמש לוחץ על מוצר מתוך החיפוש

    let item = this.Ingredients[args.index]//הפרדה לכל מוצר כ-ITEM
    item.isChecked = false;//כל מוצר מקבל מצב FALSE
    item.exDate="";//כל מוצר מקבל תיבה של תאריך ריק
    this.SelectedIngredients.push(item)//כל מוצר שנלחץ מתוך החיפוש , נכנס לתוך הרשימת מוצרים של המשתמש
    this.groceries.saveSelectedIngredients(item, this.ind)//פונקציה מתוך הסרביס כדי לשמור את המוצרים לכל משתמש בפיירבייס ובלוקל סטורג
    this.searchBar.text = '';
    this.onClear(args);

  }

  selectedTap(args: ItemEventData) {//פונקציה הוקראת בלחיצה על כל מוצר ברשימה השמורה של המשתמש בדף הבית

    this.ind = args.index // האינדקס של איפה שלחצנו באפליקציה
    let item = this.SelectedIngredients[this.ind]//המוצר הנלחץ לפי האינדקס שלו
    item.isChecked = !item.isChecked//בלחיצה על מוצר- המוצר מקבל טרו- משתנה בוליאני
    this.groceries.saveSelectedIngredients(item, this.ind)// פונקציה לסרביס כדי לעדכן את הפיירבייס ולוקל סטורג
    this.ind = -1 // לאפס את האינדקס
  }
  //deleteItem(args:ItemEventData){
  // let item = this.SelectedIngredients[args.index]
  //item.delete().catch((error) => { alert(error); });
  //this.groceries.saveSelectedIngredients(item)
  //}

  isCheckedArrayFiller() {//פונקציה שמכניסה את המוצרים שהם עם המשתנה הבוליאני "טרו" לתוך רשימה חדשה
    this.isCheckedArray = [] // הגדרת רשימה ריקה כל קריאה חדשה לפנקציה
    this.SelectedIngredients.forEach(items => { // מעבר על כל האייטמס שהם טרו
      if (items.isChecked == true) {
        this.isCheckedArray.push(items) // לדחוף את כל אלו שהם טרו לתוך הרשימה הריקה מהשורה הראשונה
      }
    }
    )
    //console.log(this.isCheckedArray) // להדפיס את הרשימה (רק בשבילנו, לא לשימוש אמיתי)
    ApplicationSettings.setString("CheckedIngredients", JSON.stringify(this.isCheckedArray))//שומר את הרשימה בתוך אפ - סטינגז לשימוש בעתיד
  }

  async remove(item) {//פונקציה שמסירה מוצר מהרשימה של המשתמש
    for (let i = 0; i < this.SelectedIngredients.length; i++) {
      if (this.SelectedIngredients[i].ID === item.ID) {//עובר על כל המוצרים בלולאה ומשיג את המוצר הנבחר לפי ID

        this.SelectedIngredients.splice(i, 1);//מוחק מהרשימה - UI
        break;
      }
    }

    await this.groceries.deleteSelectedIngredients(item);//פונקציה הנמצאת בסרביס כדי לעדכן את הרשימה בפיירבייס
  }

  async editDate(item){//פונקציה שפועלת כדי לתת למשתמש לערוך את התאריך לכל מוצר

    let d = await Dialogs.prompt({//תיבה שבא נמצא האפשרות לערוך תאריך וכפתור של שמירה
      title:"Enter date (YYYY-MM-DD)",
      okButtonText:"Save",
      cancelButtonText:"Cancel",
    })
    let ind;

    if(d.text =='')
    return; 

    for (let i = 0; i < this.SelectedIngredients.length; i++) {
      if (this.SelectedIngredients[i].ID === item.ID)//עובר על המוצרים ועובד על המוצר הנבחר לפי ה ID
       {
        let dd = new Date(d.text).getTime()
        console.log("dd => ",dd)
        console.log('new Date(d.text) --> ',new Date(d.text))
        let start=Date.now()
        item.timeLeft = Math.ceil((Math.abs(start-dd)) / (1000*60*60*24 ))
        item.exDate = d.text;
        ind = i;
        console.log("1", this.SelectedIngredients[i])
        console.log("2",item)
        this.SelectedIngredients[i] = item;
        console.log("3",this.SelectedIngredients[i])
        
        break;

      }

    }
    
    
    this.groceries.saveSelectedIngredients(item, ind)
    this.refreshDate();
    
    
  }



  async refreshDate(){
    console.log('refDate')
    if (this.SelectedIngredients === []){
      return;
    }
    let ind;
    // let len = this.SelectedIngredients.length
    for (let i = 0; i < this.SelectedIngredients.length; i++) {
      let item = Object.assign({}, this.SelectedIngredients[i])
      // console.log(this.SelectedIngredients[i])
      // console.log(item)
      if (item.exDate != "") // צריך לערוך את זה לפי מה שמוגדר הערך הראשון של התאריך
       {
        let dd = new Date(item.exDate).getTime()
        // console.log(dd)
        let start=Date.now()
        // console.log(start)
        // console.log(((Math.abs(start-dd))))
        item.timeLeft = Math.ceil((Math.abs(start-dd)) / (1000*60*60*24 ))
        ind = i;
        // console.log(ind)
        await this.groceries.saveSelectedIngredients(item, ind)
        // console.log(item)
      }

    }

  }

  showDate(item){
    Dialogs.alert({
      title: item.Name,
      message: item.exDate + " " + item.timeLeft + " Days Left",
      okButtonText: "Ok"
    })

    
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

