import { Component, Input } from '@angular/core';
import { Item } from '../../models/item';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  @Input() public inventory: Item[];

  public hoverItem: Item;
}
