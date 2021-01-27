/// <reference types="jquery"/>

import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'temporal-still';

    @ViewChild('scrollTopWrapper')
    scrollTopWrapper!: ElementRef<HTMLElement>;

    @HostListener('document:scroll')
    onScroll(): void {
        const element = this.scrollTopWrapper.nativeElement;
        const enableButton = window.pageYOffset > 100;
        element.classList.toggle('show', enableButton);
    }

    scrollToTop(): void {
        const offset = $(document.body).offset();
        if (!offset) return;
        $('html, body').animate({
            scrollTop: offset.top,
        }, 500, 'linear');
    }
}
