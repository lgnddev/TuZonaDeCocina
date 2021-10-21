import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild("title", { read: ElementRef, static: true }) title: ElementRef;

  login: any = {
    Usuario: "",
    Contrasena: ""
  };

  user = "Jorge";
  pass = 1234;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public load: Boolean = false;
  

  constructor(private router: Router, private animationCtrl: AnimationController, public toastController: ToastController) { }

  ngOnInit() {
    const animation = this.animationCtrl
      .create()
      .addElement(this.title.nativeElement)
      .duration(1500)
      .fromTo("opacity", 0, 1);
    animation.play();
  }
  
  field: string = "";
  //this.auth.login(this.login.Usuario, this.login.Password);
  ingresar() {
    if (this.validateModel(this.login)) {
      if (this.user == this.login.Usuario && this.pass == this.login.Contrasena) {
        this.presentToast("Bienvenido " + this.login.Usuario);
        let navigationExtras: NavigationExtras = {
          state: {
            user: this.login.user
          }
        }
        this.load = true;
        setTimeout(() => {
          this.load = false;
          this.router.navigate(['/folder/Inbox'], navigationExtras);
        }, 2000)
        this.login.user = null;
      }
      else {
        this.presentToast("Usuario y/o contraseña incorrecta");
      }
    }
    else {
      this.presentToast("Falta el campo " + this.field);
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

  validateModel(model: any) {
    for (var [key, value] of Object.entries(model)) {
      if (value == "") {
        this.field = key;
        return false;
      }
    }
    return true;
  }
}