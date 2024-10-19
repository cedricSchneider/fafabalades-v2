import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Chest } from '../../models/chest';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item';

@Component({
  selector: 'app-chest-result',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './chest-result.component.html',
  styleUrl: './chest-result.component.scss'
})
export class ChestResultComponent {
  @Input() public data: { chest: Chest, content: Item[], loading: boolean};
  public hoverItem: Item;
  
  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  public close() {
    this.activeModal.dismiss();
  }
}
