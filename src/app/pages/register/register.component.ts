import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service'
import { Users } from '../../services/users.service'

@Component({
  moduleId: module.id,
  selector: 'ns-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  public user = new Users();
  isAuthenticating = false;


  constructor(private users: UsersService) {
    
   }

  ngOnInit(): void {
    
  }
  

  userAdding() {
    console.log(this.user)
    this.users.addUser(this.user)
    
  }
}
