import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/Inbox', icon: 'home' },
    { title: 'Tus Recetas', url: '/tus-recetas', icon: 'book' },
    { title: 'Favoritos', url: '/folder/Archived', icon: 'heart' },
    { title: 'Configuracion', icon: 'cog' },
    { title: 'Cerrar Sesion', url: '/login', icon: 'log-out' },
  ];
}
