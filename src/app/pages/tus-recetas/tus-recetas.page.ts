import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';


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

  constructor(public actionSheetController: ActionSheetController) { }

  ngOnInit() {
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
