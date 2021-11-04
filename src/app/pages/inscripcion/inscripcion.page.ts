import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BDService } from 'src/app/servicios/bd.service';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.page.html',
  styleUrls: ['./inscripcion.page.scss'],
})
export class InscripcionPage implements OnInit {
  

  constructor(private router: Router, private servicioDB: BDService, public toastController: ToastController) { }

  ngOnInit() {
      this.servicioDB.dbState().subscribe((res) =>{
        if(res){
          this.servicioDB.fetchUsuario().subscribe(item =>{
            this.usuario = item;
          })
        }
      });
  }

  nuevoUsuario: any = {
    nombre: "",
    apellido: "",
    fnacimiento: "",
    email: "",
    contrasena: ""
  };

  usuario: any []=[]

  registrar() {
    this.servicioDB.addUsuario(this.nuevoUsuario.nombre, this.nuevoUsuario.apellido, this.nuevoUsuario.fnacimiento, this.nuevoUsuario.email, this.nuevoUsuario.contrasena, 1);
    this.presentToast("Usuario Registrado");
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
