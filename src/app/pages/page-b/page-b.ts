import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-b',
  imports: [],
  templateUrl: './page-b.html',
  styleUrl: './page-b.scss',
})
export class PageB implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('Page B : ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('Page B : ngOnDestroy');
  }
}
