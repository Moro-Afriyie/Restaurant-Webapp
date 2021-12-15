import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  logOut(): void {
    // this.authService
    //   .logOut()
    //   .then((res) => {
    //     this.router.navigate(['/login']);
    //   })
    //   .catch((err) => console.log(err));
  }
}
