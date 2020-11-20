import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss'],
})
export class KeypadComponent implements OnInit {

  @Input() codeViewStyle: any;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  public zoom: number = 1;
  pin: '';
  pins: any = [
    {
      1: 'pin1',
      2: 'pin2',
      3: 'pin3',
      4: 'pin4',
      5: 'pin5',
      6: 'pin6'
    }
  ];
  constructor() { }

  ngOnInit() {
    this.handleInput('clear');
  }

  emitEvent() {
    this.change.emit(this.pin);
  }
  pinLen() {
    return this.pin.length;
  }
  handleInput(pin: string) {

    // console.log('status', this.codeViewStyle);

    if (pin === 'clear') {
      this.pin = '';
      this.pins.pin1 = '_';
      this.pins.pin2 = '_';
      this.pins.pin3 = '_';
      this.pins.pin4 = '_';
      this.pins.pin5 = '_';
      this.pins.pin6 = '_';
      return;
    }

    if (this.pin.length === 6) {
      return;
    }
    
    this.pin += pin;
    if (this.pin.length === 6) {
      this.change.emit(this.pin);
      return;
    }
    this.pins['pin' + this.pin.length] =  this.codeViewStyle === 'star' ? '*' :  pin;
  }

  /**
 * Called on window resize.
 * 
 */
  public onWindowResize(event): void {
    // @TODO resize content
    // .parentElement.parentElement.querySelector(this.resize);
    //     height: calc(100% - 287px);

    let referenceHeight = 568; // iPhone 5
    let currentHeight = window.screen.height;
    this.zoom = currentHeight / referenceHeight;
  }

}
