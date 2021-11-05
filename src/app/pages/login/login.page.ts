import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastController } from '@ionic/angular';
import { BDService } from 'src/app/servicios/bd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild("title", { read: ElementRef, static: true }) title: ElementRef;

  usuarioIngresado: any = {
    Usuario: "",
    Contrasena: ""
  };

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public load: Boolean = false;
  
  field: string = "";
  usuario: any = []

  constructor(private router: Router, private animationCtrl: AnimationController, public toastController: ToastController, private servicioDB: BDService) { }

  ngOnInit() {
    const animation = this.animationCtrl
      .create()
      .addElement(this.title.nativeElement)
      .duration(1500)
      .fromTo("opacity", 0, 1);
    animation.play();

    this.servicioDB.dbState().subscribe((res) =>{
      if(res){
        this.servicioDB.fetchUsuario().subscribe(item =>{
          this.usuario = item;
        })
      }
    });
  }

  async login(){
    await this.servicioDB.login(this.usuarioIngresado.Usuario, this.usuarioIngresado.Contrasena)
    if (this.usuario.length == 0) {
      this.presentToast("El usuario no existe")
    } else {
      this.router.navigate(['folder/Inbox'])
    }
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create(
      {
        cssClass: 'toast-wrapper.toast-bottom',
        message: message,
        position: 'bottom',
        duration: duration ? duration : 2000
      }
    );
    toast.present();
  }
  
}