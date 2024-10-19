import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private ngbModal: NgbModal) {}

  public open(content: any, options: NgbModalOptions = {}) {
    return this.ngbModal.open(content, {
      centered: true,
      ...options,
    });
  }

}
