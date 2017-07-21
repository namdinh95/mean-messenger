import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/Rx'; // Library not from Angular 2 to unlock map()
import { Observable } from 'rxjs';

import { Message } from './message.model';

@Injectable() // decorator to allow dependency injection, does nothing
export class MessageService {
  private messages: Message[] = [];
  messageIsEdit = new EventEmitter<Message>();

  constructor(private http: Http) {}

  addMessage(message: Message) {
    const body = JSON.stringify(message);
    // Change content type from plain text to json
    const headers = new Headers({'Content-Type': 'application/json'});
    // Return observable for other components to use
    return this.http.post(
      'http://localhost:3000/message', 
      body,
      {headers: headers}
    )
      .map((response: Response) => {
        const result = response.json();
        const message = new Message(result.obj.content, 'Dummy', result.obj._id, null);
        this.messages.push(message);
        return message;
      }) // map auto convert to Observable
      .catch((error: Response => Observable.throw(error.json()))); // not catch
  }

  getMessages() {
    return this.http.get('http://localhost:3000/message')
      .map((response: Response) => {
        const messages = response.json().obj;
        let transformedMessages: Message[] = [];
        for (let message of messages) {
          transformedMessages.push(new Message(
            message.content,
            'Dummy',
            message._id,
            null
          ));
        }
        this.messages = transformedMessages;
        return transformedMessages;
      }).catch((error: Response => Observable.throw(error.json())));
  }

  editMessage(message: Message) {
    this.messageIsEdit.emit(message);
  }

  updateMessage(message: Message) {
    const body = JSON.stringify(message);
    // Change content type from plain text to json
    const headers = new Headers({'Content-Type': 'application/json'});
    // Return observable for other components to use
    return this.http.patch(
      'http://localhost:3000/message/' + message.messageId, 
      body,
      {headers: headers}
    )
      .map((response: Response) => response.json()) // map auto convert to Observable
      .catch((error: Response => Observable.throw(error.json()))); // not catch
  }

  deleteMessage(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);
    return this.http.delete('http://localhost:3000/message/' + message.messageId)
      .map((response: Response) => response.json()) // map auto convert to Observable
      .catch((error: Response => Observable.throw(error.json()))); // not catch
  }
}
