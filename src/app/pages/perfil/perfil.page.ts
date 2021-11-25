import { Component, OnInit } from '@angular/core';
import { BDService } from 'src/app/servicios/bd.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuarioBD: any [] = []
  usuario: any = {
    id_usu: '',
    nombre:'',
    apellidos:'',
    f_nacimiento:'',
    email:'',
    contrasena:'',
  }
  boton: boolean = true;
  count: any;
  nombre : string = ""
  apellido : string = ""
  contadorRecetas: any;
  contadorComentarios: any;
  constructor(private servicioDB: BDService) { }

  async ngOnInit() {
    await this.servicioDB.dbState().subscribe((res) =>{
      if(res){
        this.servicioDB.fetchUsuario().subscribe(item =>{
          this.usuarioBD = item;
        })
      }
    });
    await this.TraspasarDatos();
    await this.servicioDB.countReceta(this.usuario.id_usu)
    await this.servicioDB.dbState().subscribe((res) =>{
      if(res){
        this.servicioDB.fetchCount().subscribe(item =>{
          this.count = item;
        })
      }
    });
    await this.traspasarCount();
}

traspasarCount(){
  var count = this.count[0]
  this.contadorRecetas = count.CuentaRecetas;
  this.contadorComentarios = count.CuentaComentarios;
}

  TraspasarDatos() {
    var usuario = this.usuarioBD[0];
    this.usuario.id_usu = usuario.id_usu;
    this.usuario.nombre = usuario.nombre;
    this.usuario.apellidos = usuario.apellidos;
    this.usuario.f_nacimiento = usuario.f_nacimiento;
    this.usuario.email = usuario.email
    this.usuario.contrasena = usuario.contrasena;
    this.nombre = this.usuario.nombre
    this.apellido = this.usuario.apellidos
  }

  ModoInput(){
    if (this.boton) {
      this.boton = false;
    } else {
      this.boton = true;
      this.servicioDB.updateUsuario(this.usuario.nombre, this.usuario.apellidos, this.usuario.f_nacimiento, this.usuario.email, this.usuario.contrasena, this.usuario.id_usu)
      this.nombre = this.usuario.nombre
      this.apellido = this.usuario.apellidos
    }
  }
}
