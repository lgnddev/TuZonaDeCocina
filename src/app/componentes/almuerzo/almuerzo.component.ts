import { Component, OnInit } from '@angular/core';
import { BDService } from 'src/app/servicios/bd.service';

@Component({
  selector: 'app-almuerzo',
  templateUrl: './almuerzo.component.html',
  styleUrls: ['./almuerzo.component.scss'],
})
export class AlmuerzoComponent implements OnInit {

  constructor(private servicioDB : BDService) { }

  listaRecetasBD : any [] = []
  
  async ngOnInit() {
    await this.servicioDB.home();
    await this.servicioDB.dbState().subscribe((res) =>{
      if(res){
        this.servicioDB.fetchHome().subscribe(item =>{
          this.listaRecetasBD = item;
        })
      }
    });
  }

  test(){
    console.log("hola")
    console.log(this.listaRecetasBD)
  }

}
