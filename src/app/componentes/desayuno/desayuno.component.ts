import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-desayuno',
  templateUrl: './desayuno.component.html',
  styleUrls: ['./desayuno.component.scss'],
})
export class DesayunoComponent implements OnInit {
  user: any;

  constructor(private router: Router, private activeroute: ActivatedRoute, private activatedRoute: ActivatedRoute) {
    this.activeroute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }
  ngOnInit() { }

  sendUser() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.user
      }
    }
    this.router.navigate(['/receta'], navigationExtras);

  }
}
