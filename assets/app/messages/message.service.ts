import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx'; // Library not from Angular 2 to unlock map()
import { Observable } from 'rxjs';

import { Message } from './message.model';

@Injectable() // decorator to allow dependency injection, does nothing
export class MessageService {
  private messages: Message[] = [];

  constructor(private http: Http) {}

  addMessage(message: Message) {
    this.messages.push(message);
    const body = JSON.stringify(message);
    // Change content type from plain text to json
    const headers = new Headers({'Content-Type': 'application/json'});
    // Return observable for other components to use
    return this.http.post(
      'http://localhost:3000/message', 
      body,
      {headers: headers}
    )
      .map((response: Response) => response.json()) // map auto convert to Observable
      .catch((error: Response => Observable.throw(error.json()))); // not catch
  }
  getMessages() {
    return this.messages;
  }
  deleteMessage(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);
  }
}
