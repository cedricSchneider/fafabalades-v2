import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Boss } from '../../models/boss';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boss-fight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boss-fight.component.html',
  styleUrl: './boss-fight.component.scss'
})
export class BossFightComponent {
  @Input() public boss: Boss;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  public closing: boolean = false;



  public close() {
    this.closing = true;
    setTimeout(() => {
      this.boss = null;
      this.onClose.emit();
      this.closing = false;
    }, 600);
  }

}
