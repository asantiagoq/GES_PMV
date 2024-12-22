import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
  standalone: true,
})
export class DeleteConfirmationComponent {
  @Input() title: string = 'Eliminar'; 
  @Input() message: string = '¿Está seguro de que desea realizar esta acción?'; 
  @Output() confirm = new EventEmitter<void>(); 

  onConfirm() {
    this.confirm.emit();
    const modalElement = document.getElementById('deleteModal') as HTMLElement;
    if (modalElement) {
      modalElement.style.display = 'none'; 
    }
  }

  onCancel() {
    const modalElement = document.getElementById('deleteModal') as HTMLElement;
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  }
}
