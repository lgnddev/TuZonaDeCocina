import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BDService } from '../../servicios/bd.service';


@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.page.html',
  styleUrls: ['./admin-usuarios.page.scss'],
})
export class AdminUsuariosPage implements OnInit {

  usuarios: any [] = []

  constructor(private router: Router, private servicioBD: BDService) { }

  ngOnInit() {
    this.servicioBD.dbState().subscribe((res)=>{
      if(res){
        this.servicioBD.fetchUsuario().subscribe(item =>{
          this.usuarios = item;
        })
      }
    });
  }

}
