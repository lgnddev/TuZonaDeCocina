import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Router } from '@angular/router';
import { BDService } from 'src/app/servicios/bd.service';

@Component({
  selector: 'app-nueva-receta',
  templateUrl: './nueva-receta.page.html',
  styleUrls: ['./nueva-receta.page.scss'],
})
export class NuevaRecetaPage implements OnInit {

  nreceta: any = {
    nom_receta: '',
    tiempo: '',
    ingredientes: '',
    preparacion: '',
    descripcion: '',
    id_difi: '',
    id_tipo: '',
    id_usu: ''
  }


  @ViewChild('stepper') stepper;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  endOfForm: boolean = false;
  startOfForm: boolean = true;
  headers = ["Ingrediente", "Cantidad"];
  rows = []
  ingrediente: string;
  cantidad: string;
  items = [];
  valor: number;
  usuarioBD: any[] = []
  idUsuario: string = "";

  constructor(private _formBuilder: FormBuilder, private router: Router, private servicioDB: BDService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.servicioDB.dbState().subscribe((res) => {
      if (res) {
        this.servicioDB.fetchUsuario().subscribe(item => {
          this.usuarioBD = item;
        })
      }
    });
    this.TraspasarID();
  }

  TraspasarID() {
    var usuario = this.usuarioBD[0];
    this.idUsuario = usuario.id_usu;
    this.nreceta.id_usu = this.idUsuario
  }

  Anterior() {
    this.stepper.previous();
  }

  Siguente() {
    this.stepper.next();

  }

  agregar() {
    this.rows.push({
      "Ingrediente": this.ingrediente,
      "Cantidad": this.cantidad
    })
    this.items.push([this.ingrediente, this.cantidad])
  }

  deleteRow(d) {
    const index = this.rows.indexOf(d);
    this.rows.splice(index, 1);
    this.items.splice(index, 1);
  }

  selectionChange(event: StepperSelectionEvent) {
    if (event.selectedIndex == 3) {
      this.endOfForm = true;
    } else {
      this.endOfForm = false;
    }
    if (event.selectedIndex == 0) {
      this.startOfForm = true;
    } else {
      this.startOfForm = false;
    }
  }

  input(event: MatSliderChange) {
    this.valor = event.value
  }

  guardar() {
    var str = this.items.map(e => e.join(':')).join(';')
    this.nreceta.ingredientes = str
    this.servicioDB.addReceta(this.nreceta.nom_receta, this.nreceta.tiempo, this.nreceta.ingredientes, this.nreceta.preparacion, this.nreceta.descripcion, this.nreceta.id_difi, this.nreceta.id_tipo, this.nreceta.id_usu);
  }

}
