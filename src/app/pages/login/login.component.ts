import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Users } from '../../services/users.service'


@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user = new Users();
  

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

  async Login() {
    console.log(this.user)
    await this.usersService.loginUser(this.user)
     
  }


}

  
