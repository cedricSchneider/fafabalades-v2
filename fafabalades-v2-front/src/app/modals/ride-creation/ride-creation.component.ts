import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '../../models/profile';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ride-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
  templateUrl: './ride-creation.component.html',
  styleUrl: './ride-creation.component.scss'
})
export class RideCreationComponent implements OnInit {
  @Input() public profile: Profile;
  public rideForm: FormGroup;
  public maxDate: NgbDate;
  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.maxDate = new NgbDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    this.rideForm = new FormGroup({
      date: new FormControl(this.maxDate, [Validators.required]),
      type: new FormControl(1, [Validators.required]),
      distance: new FormControl(null, [Validators.required, Validators.min(1)]),
      nbSteps: new FormControl(null, [Validators.min(1)]),
    });
  }

  public getNbCredits() {
    if (this.rideForm.get('type').value == 1) {
      return this.rideForm.get('distance').value;
    } else {
      return Math.round(this.rideForm.get('distance').value / 3);
    }
  }

  public stepsChanged() {
    if (this.rideForm.get('distance').value == null && this.rideForm.get('nbSteps').value != null && this.rideForm.get('nbSteps').value > 0) {
      this.rideForm.get('distance').setValue(Math.round(this.rideForm.get('nbSteps').value * 0.762));
    }
  }

  public send() {
    // TODO call api & remove this because ws subscription you know
    this.profile.credits += this.getNbCredits();
    this.toastr.success('Balade ajoutée !');
    this.activeModal.close();
  }

  public close() {
    this.activeModal.dismiss();
  }
}
