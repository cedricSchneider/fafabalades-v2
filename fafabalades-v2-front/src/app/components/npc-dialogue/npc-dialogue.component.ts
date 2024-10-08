import { Component, EventEmitter, Input, input, OnChanges, OnInit, Output, output } from '@angular/core';
import { Npc } from '../../models/npc';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-npc-dialogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './npc-dialogue.component.html',
  styleUrl: './npc-dialogue.component.scss'
})
export class NpcDialogueComponent implements OnInit, OnChanges {
  @Input() public npc: Npc;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  public dialogueContent: string = '';

  private dialogueDelay: number = 800;
  private letterDelay: number = 30;
  private linebreakDelay: number = 250;

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.npc != null) {
      setTimeout(() => { this.incDialogue() }, this.dialogueDelay);
    }
  }

  public incDialogue() {
    if (this.npc != null) {
      const charToAdd: string = this.npc.dialogueContent[this.dialogueContent.length];
      this.dialogueContent += charToAdd;
      if (this.dialogueContent.length < this.npc.dialogueContent.length) {
        setTimeout(() => { this.incDialogue() }, charToAdd == '\n' ? this.linebreakDelay : this.letterDelay);
      }
    }
  }

  public close() {
    this.npc = null;
    this.dialogueContent = '';
    this.onClose.emit();
  }
}
