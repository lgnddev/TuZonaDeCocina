import { Component, OnInit } from '@angular/core';
import { BDService } from './servicios/bd.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(private servicioDB : BDService){}

  tipoUsuario: any;
  public appPages = [
    { title: 'Home', url: '/folder/Inbox', icon: 'home' },
    { title: 'Tus Recetas', url: '/tus-recetas', icon: 'book' },
    { title: 'Favoritos', url: '/folder/Archived', icon: 'heart' },
    { title: 'Administrar Usuarios', url: '/admin-usuarios', icon: 'book'},
    { title: 'Administrar Recetas', url: '/admin-recetas', icon: 'book' },
    { title: 'Configuracion', icon: 'cog' },
    { title: 'Perfil', url: '/perfil', icon: 'person' },
    { title: 'Cerrar Sesion', url: '/login', icon: 'log-out' },
  ];

  async ngOnInit(){
    await this.servicioDB.dbState().subscribe((res) =>{
      if(res){
        this.servicioDB.fetchUsuario().subscribe(item =>{
          this.tipoUsuario = item;
        })
      }
    });
    await console.log(this.tipoUsuario + 'holaa')
  }

}
