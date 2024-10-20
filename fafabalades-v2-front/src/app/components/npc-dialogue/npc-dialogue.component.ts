import { Component, EventEmitter, Input, input, OnChanges, OnInit, Output, output } from '@angular/core';
import { Npc } from '../../models/npc';
import { CommonModule } from '@angular/common';
import { NpcDialogue } from '../../models/npcDialogue';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../models/item';

@Component({
  selector: 'app-npc-dialogue',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './npc-dialogue.component.html',
  styleUrl: './npc-dialogue.component.scss'
})
export class NpcDialogueComponent implements OnInit, OnChanges {
  @Input() public npc: Npc;
  @Input() public dialogueResult: NpcDialogue;
  @Input() public loadingActionSubmission: boolean;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  public dialogueContent: string = '';
  public closing: boolean = false;

  private dialogueDelay: number = 800;
  private letterDelay: number = 30;
  private linebreakDelay: number = 250;
  public loadingDialogue: boolean;
  public showRewards: boolean = false;
  public hoverItem: Item;

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.npc != null && !this.loadingActionSubmission) {
      setTimeout(() => { this.incDialogue() }, this.dialogueDelay);
    }
  }

  public incDialogue() {
    if (this.npc != null) {
      const charToAdd: string = this.dialogueResult.content[this.dialogueContent.length];
      this.dialogueContent += charToAdd;
      if (this.dialogueContent.length < this.dialogueResult.content.length) {
        setTimeout(() => { this.incDialogue() }, charToAdd == '\n' ? this.linebreakDelay : this.letterDelay);
      } else {
        if (this.dialogueResult.rewards.length > 0) {
          this.showRewards = true;
        }
      }
    }
  }

  public close() {
    this.closing = true;
    setTimeout(() => {
      this.npc = null;
      this.dialogueResult = null;
      this.dialogueContent = '';
      this.onClose.emit();
      this.closing = false;
      this.showRewards = false;
    }, 600);
  }
}
