import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    private router: Router
  ){}

  toTerms(){
    this.router.navigate(['/terms'])
  }

  toFaq(){
    this.router.navigate(['/faq'])
  }

  toCustomers(){
    this.router.navigate(['/nuestrosclientes'])
  }
}
