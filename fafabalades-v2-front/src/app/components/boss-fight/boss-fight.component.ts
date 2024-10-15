import { Component, EventEmitter, input, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Boss } from '../../models/boss';
import { CommonModule } from '@angular/common';
import { Profile } from '../../models/profile';
import { FloorPipe } from '../../pipes/floor.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-boss-fight',
  standalone: true,
  imports: [CommonModule, FloorPipe, FormsModule],
  templateUrl: './boss-fight.component.html',
  styleUrl: './boss-fight.component.scss'
})
export class BossFightComponent implements OnInit, OnChanges {
  @Input() public boss: Boss;
  @Input() public profile: Profile;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  public closing: boolean = false;
  public hpAnimationDelay = 20;
  public hpAnimationDuration = 500;
  public displayHp: number = 0;
  public currentLifeAnimationId: any = null;

  public maxDamage: number;
  public hpCost: number = 10;
  public damage: number = null;

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.boss != null) {
      this.displayHp = 0;
      this.damage = null;
      this.maxDamage = Math.min(this.boss.life, Math.floor(this.profile.credits / this.hpCost));
      setTimeout(() => {
        this.initLifeAnimation();
      }, 1600);
    }
  }

  public initLifeAnimation() {
    let totalOffset = this.boss.life - this.displayHp;
    let offset = totalOffset / (this.hpAnimationDuration / this.hpAnimationDelay);
    this.runLifeAnimation(offset);
  }

  public runLifeAnimation(offset: number) {
    const animationId = setTimeout(() => {
      if (this.currentLifeAnimationId == animationId) {
        this.displayHp += offset;
        if (offset < 0) {
          this.displayHp = Math.max(this.displayHp, this.boss.life)
        } else {
          this.displayHp = Math.min(this.displayHp, this.boss.life);
        }
        if (this.displayHp != this.boss.life) {
          this.runLifeAnimation(offset);
        }
      }
    }, this.hpAnimationDelay);
    this.currentLifeAnimationId = animationId;
  }

  public close() {
    this.closing = true;
    setTimeout(() => {
      this.boss = null;
      this.onClose.emit();
      this.closing = false;
    }, 600);
  }

  public isValidDamageFormat() {
    return this.damage != null && !isNaN(this.damage) && this.damage >= 1 && this.damage % 1 == 0 && this.damage;
  }

  public checkDamageValue() {
    if (!this.isValidDamageFormat()) {
      this.damage = null;
    } else if (this.damage > this.maxDamage) {
      this.damage = this.maxDamage;
    }
  }

  public validateForm() {
    this.inflictDamage(this.damage);
    this.profile.credits -= this.damage * this.hpCost;
    this.damage = null;
  }

  public inflictDamage(value: number) {
    let damage = this.boss.life - Math.max(this.boss.life - value, 0)
    this.boss.life -= damage;
    let totalOffset = this.boss.life - this.displayHp;
    let offset = totalOffset / (this.hpAnimationDuration / this.hpAnimationDelay);
    this.runLifeAnimation(offset);
  }
}
