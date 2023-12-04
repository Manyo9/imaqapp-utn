import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { UserProfileDTO } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: UserProfileDTO;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) { }
  
  private subs: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.subs.add(
      this.userService.myProfile().subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.user = result.result as UserProfileDTO;
          } else {
            swal({ title: 'Oops!', text: `Error al obtener perfil: ${result.message}`, icon: 'error' });
          }
        },
        error: (error) => {
          if(error.error.message){
            swal({title:'Oops!', text:`Error al obtener perfil: ${error.error.message}`, icon: 'error'});
          } else {
            swal({title:'Oops!', text:`Error al obtener perfil.`, icon: 'error'});
            console.error(error);
          }
        }
      })
    )
  }

  logOut() {

  }

  changePass() {
    this.router.navigate(['/perfil/contraseña']);
  }

  cancel(): void {
    this.router.navigate(['/inicio']);
  }
}
