import { Component, OnInit } from '@angular/core';
import {Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receta',
  templateUrl: './receta.page.html',
  styleUrls: ['./receta.page.scss'],
})
export class RecetaPage implements OnInit {

  user : any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private activeroute: ActivatedRoute) { 
    this.activeroute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }
  
  ngOnInit() {
  }

}
