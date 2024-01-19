import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{
   ngOnInit(): void {
       
   }
  
  slideConfig = {
    slidesToShow: 1, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: true
  };
  slideConfigAgency = {
    slidesToShow: 5, 
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    dots: false
  };
  

}
