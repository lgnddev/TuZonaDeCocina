import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { BDService } from 'src/app/servicios/bd.service';

@Component({
  selector: 'app-receta',
  templateUrl: './receta.page.html',
  styleUrls: ['./receta.page.scss'],
})
export class RecetaPage implements OnInit {

  user: any;
  id: any;
  recetaBD: any[] = []
  receta: any = {
    id_receta: '',
    nom_receta: '',
    tiempo: '',
    ingredientes: '',
    preparacion: '',
    descripcion: '',
    id_difi: '',
    id_tipo: '',
    id_usu: '',
  }
  ingredientes : any [] = []

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private activeroute: ActivatedRoute, private servicioDB: BDService) {
    this.activeroute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
        this.id = this.router.getCurrentNavigation().extras.state.id;
      }
    });
  }

  async ngOnInit() {
    await this.servicioDB.fichaReceta(this.id)
    await this.servicioDB.dbState().subscribe((res) => {
      if (res) {
        this.servicioDB.fetchFRec().subscribe(item => {
          this.recetaBD = item;
        })
      }
    });
    await this.traspasarDatos()
  }

  traspasarDatos() {
    var receta = this.recetaBD[0];
    this.receta.id_receta = receta.id_receta,
    this.receta.nom_receta = receta.nom_receta,
    this.receta.tiempo = receta.tiempo,
    this.receta.ingredientes = receta.ingredientes,
    this.receta.preparacion = receta.preparacion,
    this.receta.descripcion = receta.descripcion
    if (receta.id_difi == "1"){
      this.receta.id_difi = "Facil";
    } else if (receta.id_difi == "2"){
      this.receta.id_difi = "Medio";
    } else if (receta.id_difi == "3"){
      this.receta.id_difi = "Dificil";
    }
    if (receta.id_tipo == 1) {
      this.receta.id_tipo == "Desayuno"
    } else if (receta.id_tipo == 2) {
      this.receta.id_tipo == "Ensalada"
    } else if (receta.id_tipo == 3) {
      this.receta.id_tipo == "Almuerzo"
    } else if (receta.id_tipo == 4) {
      this.receta.id_tipo == "Postre"
    }
    this.receta.id_usu = receta.id_usu
    this.ingredientes = this.receta.ingredientes.split(";").map(function(x){return x.split(":")})
  }

  test(){
    console.log(this.recetaBD)
  }

}
