import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { HeaderComponent } from '../header/header.component';
import { HeaderSalidasComponent } from '../header-salidas/header-salidas.component';
import { SalidaService } from '../services/salida.service';
import { MatDialog } from '@angular/material/dialog';
import { SalidaDialogComponent } from '../salida-dialog/salida-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-salidas',
  standalone: true,
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.css'],
  imports: [
    CommonModule,
    DeleteConfirmationComponent,
    HeaderComponent,
    HeaderSalidasComponent,
    MatSnackBarModule,  
  ],
})
export class SalidasComponent implements OnInit {
  salidas: any[] = []; 
  deleteMessage: string = ''; 
  salidaAEliminar: number | null = null; 

  constructor(private salidaService: SalidaService, public dialog: MatDialog, private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {
    this.cargarSalidas(); 
  }

 
  cargarSalidas(): void {
    this.salidaService.getAllNotas().subscribe(
      (notas: any[]) => {
        this.salidas = notas.map((nota) => ({
          id: nota.NoteID,
          cantidadTotal: nota.Products.reduce(
            (total: number, product: any) => total + product.Quantity,
            0
          ),
          precioTotal: nota.Products.reduce(
            (total: number, product: any) => total + product.Quantity * 10,
            0
          ), 
          fecha: nota.Date,
          productos: nota.Products,
        }));
      },
      (error) => {
      
        this.snackBar.open('Error al cargar las salidas: ' + error.message, 'Cerrar', {
          duration: 5000, 
        });
      }
    );
  }

  imprimirNota(id: string): void {
    this.salidaService.getNotaFile(id).subscribe(
      (file: Blob) => {
        const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Nota_${id}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },

      (error) => {
       
        this.snackBar.open('Error al descargar la nota : ' + error.message, 'Cerrar', {
          duration: 5000, 
        });
      }
    );
  }

  editarNota(id: string): void {
    const nota = this.salidas.find((salida) => salida.id === id);
    const dialogRef = this.dialog.open(SalidaDialogComponent, {
      width: '600px',
      data: nota, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.salidaService.updateNota(id, result).subscribe(
          () => {
            alert('Nota actualizada exitosamente.');
            this.cargarSalidas(); 
          },
          (error) => {

            this.snackBar.open('Error al actualizar la nota: ' + error.message, 'Cerrar', {
              duration: 5000, 
            });
          }
        );
      }
    });
  }

 
  eliminarNota(id: string): void {
    this.salidaService.deleteNota(id).subscribe(
      () => {
        alert('Nota eliminada exitosamente.');
        this.cargarSalidas();
      },
      (error) => {
        this.snackBar.open('Error al eliminar la nota: ' + error.message, 'Cerrar', {
          duration: 5000, 
        });
      }
      
    );
  }

  openDeleteConfirmation(id: number): void {
    this.salidaAEliminar = id;
    this.deleteMessage = `¿Está seguro de que desea eliminar la nota de salida con ID "${id}"?`;
  }

  onDeleteConfirmed(): void {
    if (this.salidaAEliminar !== null) {
      this.eliminarNota(this.salidaAEliminar.toString());
      this.salidaAEliminar = null; 
    }
  }
}
