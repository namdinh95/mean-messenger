import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from './message.service';
import { Message } from './message.model';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html'
})
export class MessageInputComponent {
  message: Message;

  constructor(private messageService: MessageService) {}

  onSubmit(form: NgForm) {
    if (this.message) {
      // not null == editing
      this.message.content = form.value.content;
      this.messageService.updateMessage(this.message).subscribe(
        result => console.log(result);
      );
      this.message = null; // to clear form correctly
    } else {
      // null == submit new message
      const message = new Message(form.value.content, 'Nam');
      this.messageService.addMessage(message)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        ); // sending out observable
    }
    form.resetForm(); // Clear form after submit
  }

  onClear(form: NgForm) {
    this.message = null; // to clear form correctly
    form.resetForm();
  }

  ngOnInit() {
    this.messageService.messageIsEdit.subscribe(
      (message: Message) => this.message = message
    );
  }
}
