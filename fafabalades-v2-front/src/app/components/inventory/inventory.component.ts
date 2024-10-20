import { Component, DoCheck, input, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Item } from '../../models/item';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '../../models/profile';
import { ModalService } from '../../services/modal.service';
import { UserMap } from '../../models/userMap';
import { GiftComponent } from '../../modals/gift/gift.component';
import { GiftedItem } from '../../models/giftedItem';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, OnChanges {
  @Input() public profile: Profile;
  @Input() public users: UserMap[] = [];

  public currentItems: Item[];
  public consumedItems: Item[];

  public collapseConsumed: boolean = true;
  public collapseGifted: boolean = true;

  public hoverItem: Item;
  public hoverGiftedItem: GiftedItem;

  public itemUseFunctions: Map<string, (item: Item) => void>;

  constructor(
    private modalService: ModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initUseFunctions();
    this.computeItemsList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.computeItemsList();
  }

  public computeItemsList() {
    this.currentItems = this.profile.inventory.filter((x) => x.consumedAt == null);
    this.consumedItems = this.profile.inventory.filter((x) => x.consumedAt != null);
  }

  public initUseFunctions() {
    this.itemUseFunctions = new Map<string, (item: Item) => void>();
    this.itemUseFunctions.set('CREDITS2500', this.useCredits2500());
  }

  public clickCollapseConsumed() {
    this.collapseConsumed = !this.collapseConsumed;
    this.collapseGifted = true;
  }

  public clickCollapseGifted() {
    this.collapseGifted = !this.collapseGifted;
    this.collapseConsumed = true;
  }
  
  public sendGift(item: Item) {
    const modalRef = this.modalService.open(GiftComponent, { size: 'lg' });
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.users = this.users;
    modalRef.componentInstance.profile = this.profile;
    modalRef.result.then(() => {
      this.computeItemsList();
    }).catch(() => {
    });
  }

  useCredits2500(): (item: Item) => void {
    return (item: Item) => {
      // TODO call api
      // TODO remove because subscription will perform this
      this.profile.credits += 2500;
      item.consumedAt = new Date().toISOString();
      this.toastr.success('Crédits ajoutés !');
      this.computeItemsList();
    }
  }
}
