import { Component, OnInit } from '@angular/core';
import { BDService } from 'src/app/servicios/bd.service';

@Component({
  selector: 'app-admin-recetas',
  templateUrl: './admin-recetas.page.html',
  styleUrls: ['./admin-recetas.page.scss'],
})
export class AdminRecetasPage implements OnInit {

  constructor(private servicioBD: BDService) { }

  recetas: any = [
    {
      id_receta: '',
      nom_receta: '',
      tiempo: '',
      ingredientes: '',
      preparacion: '',
      descripcion: '',
      id_difi: '',
      id_tipo: '',
      id_usu: ''
    }
  ]

  ngOnInit() {
    this.servicioBD.dbState().subscribe((res) => {
      if (res) {
        this.servicioBD.fetchbuscarR().subscribe(item => {
          this.recetas = item;
        })
      }
    });
  }

}
