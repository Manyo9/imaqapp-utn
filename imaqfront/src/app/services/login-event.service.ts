import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginEventService {

  private loginEventSubject: Subject<boolean>;

  constructor() {
    this.loginEventSubject = new Subject<boolean>();
  }

  triggerLoginEvent(logged: boolean): void {
    this.loginEventSubject.next(logged);
  }

  onSideNavToggle(): Observable<boolean> {
    return this.loginEventSubject;
  }
}
