import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserMap } from '../../models/userMap';
import { debounceTime, map, Observable, OperatorFunction } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../models/profile';
import { Item } from '../../models/item';

@Component({
  selector: 'app-gift',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule],
  templateUrl: './gift.component.html',
  styleUrl: './gift.component.scss'
})
export class GiftComponent implements OnInit {
  @Input() public users: UserMap[] = [];
  @Input() public profile: Profile;
  @Input() public item: Item;

  public selectedUser: UserMap;
  public userSearchModel: UserMap;

  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    
  }

	search: OperatorFunction<string, readonly UserMap[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map((term: string) =>
				term === ''
					? []
					: this.users.filter((u) => u.userId != this.profile.userId && u.username.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
		);

	formatter = (x: UserMap) => x.username;

  public selectUser(value: any) {
    if (value.userId != undefined) {
      this.selectedUser = this.userSearchModel;
      this.userSearchModel = null;
    }
  }

  public validateGift() {
    // TODO call api & remove this (done by ws subscription ?)
    this.profile.giftedItems.push({
      id: new Date().getTime(),
      itemId: this.item.id,
      itemDescription: this.item.description,
      itemDisplayName: this.item.displayName,
      itemName: this.item.name,
      itemPicture: this.item.picture,
      recipienId: this.selectedUser.userId,
      recipientImageUrl: this.selectedUser.imageUrl,
      recipientUsername: this.selectedUser.username,
      date: new Date().toISOString(),
    });
    this.profile.inventory = this.profile.inventory.filter((x) => x.id != this.item.id);
    this.activeModal.close();
  }

  public close() {
    this.activeModal.dismiss();
  }
}
