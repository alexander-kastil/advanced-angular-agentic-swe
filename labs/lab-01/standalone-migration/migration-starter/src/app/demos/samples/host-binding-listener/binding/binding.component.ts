import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-binding',
  templateUrl: './binding.component.html',
  styleUrls: ['./binding.component.scss'],
})
export class BindingComponent implements OnInit {
  @HostBinding('attr.isChecked') checked = false;

  constructor() {}

  ngOnInit(): void {}
}
