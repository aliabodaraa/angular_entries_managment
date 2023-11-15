import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidenavMain') sidenavMain!: ElementRef;
  @ViewChild('logoImg') logoImg!: ElementRef;
  @ViewChild('navItemTitleA') navItemTitleA!: ElementRef;
  @ViewChild('navItemTitleB') navItemTitleB!: ElementRef;

  isOpen: boolean = true;

  routeName: string = '';

  constructor() {}

  ngOnInit(): void {}
  toggleSidenav() {
    this.isOpen = !this.isOpen;

    // reference to https://stackoverflow.com/questions/63349146/how-to-toggle-class-when-click-outside-element-with-javascript
    if (this.isOpen) {
      this.sidenavMain.nativeElement.classList.remove('close-nav-state');
      this.sidenavMain.nativeElement.classList.add('open-nav-state');

      /* Option 1 */
      // this.sidenavMain.nativeElement.style = '';
      // this.logoImg.nativeElement.style = '';
      // this.navItemTitleA.nativeElement.style = '';

      /* Option 2 */
      this.sidenavMain.nativeElement.removeAttribute('style');
      this.logoImg.nativeElement.removeAttribute('style');
      this.navItemTitleA.nativeElement.removeAttribute('style');
      this.navItemTitleB.nativeElement.removeAttribute('style');
    } else {
      this.sidenavMain.nativeElement.classList.remove('open-nav-state');
      this.sidenavMain.nativeElement.classList.add('close-nav-state');

      this.sidenavMain.nativeElement.style.width = '64px';
      this.logoImg.nativeElement.style.display = 'none';
      this.navItemTitleA.nativeElement.style.display = 'none';
      this.navItemTitleB.nativeElement.style.display = 'none';
    }
  }
}
