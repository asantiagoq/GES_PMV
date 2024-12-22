import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingreso-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ingreso-form.component.html',
  styleUrls: ['./ingreso-form.component.css'],
})
export class IngresoFormComponent {
  codigoIngreso: string = '';
  fechaIngreso: string = '';
  productoSeleccionado: string = 'Libro 1';
  cantidad: number = 0;

  productosAgregados: Array<{ producto: string; cantidad: number; precio: number }> = [];
  cantidadTotal: number = 0;
  precioTotal: number = 0;

  preciosProductos: { [key: string]: number } = {
    'El gato con botas': 35,
    'El mundo de Sopia': 32,
    'Guardianas de la salud': 10,
    'La ladrona de libros': 10,
    'Como ganar amigos e influir en ellos': 25,
    'La biblia': 50,
    'Guardianas del bosque': 30,
    'Chocolate caliente para el corazón': 34,
    'Cien años de soledad': 12,
    'Libro de aventuras': 10,
    'Mi planta de Naranja Lima': 20,

  };

  get productosDisponibles() {
    return Object.keys(this.preciosProductos);
  }

  addProducto() {
    if (this.cantidad > 0 && this.productoSeleccionado) {
      const precioUnitario = this.preciosProductos[this.productoSeleccionado] || 0;
      const totalProducto = this.cantidad * precioUnitario;

      this.productosAgregados.push({
        producto: this.productoSeleccionado,
        cantidad: this.cantidad,
        precio: totalProducto,
      });

      this.actualizarTotales();
      this.cantidad = 0;
      this.productoSeleccionado = 'Libro 1';
    }
  }

  eliminarProducto(index: number) {
    this.productosAgregados.splice(index, 1);
    this.actualizarTotales();
  }

  actualizarTotales() {
    this.cantidadTotal = this.productosAgregados.reduce((sum, item) => sum + item.cantidad, 0);
    this.precioTotal = this.productosAgregados.reduce((sum, item) => sum + item.precio, 0);
  }
}
