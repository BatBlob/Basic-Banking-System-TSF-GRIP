import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  // navigate_customers() {
  //   this.router.navigate(['/customers']);
  // }

  // navigate_home() {
  //   this.router.navigate(['']);
  // }
  navigate(to: String) {
    if (this.router.url === ("/"+to)) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(["/"+to]));
    }
    else this.router.navigate(["/"+to]);
  }
}
