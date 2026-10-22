import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page-a',
  imports: [RouterOutlet],
  templateUrl: './page-a.html',
  styleUrl: './page-a.scss',
})
export class PageA implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('Page A : ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('Page A : ngOnDestroy');
  }
}
