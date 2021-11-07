import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BDService } from 'src/app/servicios/bd.service';


@Component({
  selector: 'app-tus-recetas',
  templateUrl: './tus-recetas.page.html',
  styleUrls: ['./tus-recetas.page.scss'],
})
export class TusRecetasPage implements OnInit {

  lista: any = [

    {
      nombre: 'Panqueques con manjar'
    },
    {
      nombre: '2'
    },
    {
      nombre: '3'
    },
    {
      nombre: '4'
    },
    {
      nombre: '5'
    }
  ]

  listaRecetasBD : any [] = []
  usuarioBD: any[] = []
  idUsuario: string = "";

  constructor(public actionSheetController: ActionSheetController, private servicioDB: BDService) { }

  ngOnInit() {
    this.servicioDB.dbState().subscribe((res) =>{
      if(res){
        this.servicioDB.fetchRecUsua().subscribe(item =>{
          this.listaRecetasBD = item;
        })
      }
    });
    this.servicioDB.dbState().subscribe((res) => {
      if (res) {
        this.servicioDB.fetchUsuario().subscribe(item => {
          this.usuarioBD = item;
        })
      }
    });
    this.TraspasarID();
    this.TraerDatos();
  }

  TraspasarID() {
    var usuario = this.usuarioBD[0];
    this.idUsuario = usuario.id_usu;
  }

  async TraerDatos(){
    await this.servicioDB.recetasUsuario(this.idUsuario)
  }

  


  async presentActionSheet(mensaje: string) {
    const actionSheet = await this.actionSheetController.create({
      header: mensaje,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Visualizar',
        icon: 'eye-outline',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Modificar',
        icon: 'brush',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          console.log('Play clicked');
        }
      
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
