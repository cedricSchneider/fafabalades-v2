import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-map-pin-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-pin-action.component.html',
  styleUrl: './map-pin-action.component.scss'
})
export class MapPinActionComponent {
  public buttonContent: string;
  public action: () => void;
  public disabled: boolean = false;
}
