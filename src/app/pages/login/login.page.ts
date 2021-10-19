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
  user: String;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public load: Boolean = false;
  field: string = "";

  constructor(private router: Router, private animationCtrl: AnimationController, public toastController: ToastController) { }

  ngOnInit() {
    const animation = this.animationCtrl
    .create()
    .addElement(this.title.nativeElement)
    .duration(1500)
    .fromTo("opacity", 0, 1);
    animation.play();
  }

  
  
  sendUser() {
    if (this.user!=null) {
      let navigationExtras: NavigationExtras = {
        state: {
          user: this.user
        }
      }
      this.load = true;
      setTimeout(() => {
        this.load = false;
        this.router.navigate(['/folder/Inbox'], navigationExtras);
        this.presentToast('Inicio de Sesion Exitoso');
      }, 2000)
      this.user=null;


    }
    else {
      this.presentToast('Usuario y/o Contraseña Incorrecto');
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