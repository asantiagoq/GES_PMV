import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalidaService } from '../services/salida.service';

@Component({
  selector: 'app-salida-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salida-form.component.html',
  styleUrls: ['./salida-form.component.css'],
})
export class SalidaFormComponent implements OnInit {
  @Input() notaSeleccionada: any = null; 

  codigoSalida: string = '';
  fechaSalida: string = '';
  productoSeleccionado: string = '';
  cantidad: number = 0;
  productosAgregados: any[] = [];
  cantidadTotal: number = 0;
  precioTotal: number = 0;

  productosDisponibles: any[] = [];

  constructor(private salidaService: SalidaService) {}

  ngOnInit(): void {
    this.cargarProductos();
    if (this.notaSeleccionada) {
      this.cargarNotaParaEditar();
    }
  }

  cargarProductos(): void {
    this.salidaService.getAllProducts().subscribe(
      (productos) => {
        this.productosDisponibles = productos.map((producto) => ({
          id: producto.ProductID,
          name: producto.Name,
          price: producto.LastPrice,
        }));
        console.log('Productos cargados:', this.productosDisponibles);

        if (this.notaSeleccionada) {
          this.cargarNotaParaEditar();
        }
      },
      (error) => console.error('Error al cargar productos:', error)
    );
  }

  cargarNotaParaEditar(): void {
    if (this.notaSeleccionada) {
      this.codigoSalida = this.notaSeleccionada.id;
      this.fechaSalida = this.notaSeleccionada.fecha;
      this.productosAgregados = this.notaSeleccionada.productos.map((producto: any) => {
        const productoDetalles = this.productosDisponibles.find((p) => p.id === producto.ProductID);
        return {
          producto: productoDetalles?.name || producto.ProductID,
          id: producto.ProductID,
          cantidad: producto.Quantity,
          precio: producto.Quantity * (productoDetalles?.price || 0),
        };
      });
      this.calcularTotales();
    }
  }

  addProducto(): void {
    if (this.cantidad > 0 && this.productoSeleccionado) {
      const producto = this.productosDisponibles.find(
        (prod) => prod.id === this.productoSeleccionado
      );

      if (!producto) {
        alert('Producto no válido');
        return;
      }

      const totalProducto = this.cantidad * producto.price;

      this.productosAgregados.push({
        producto: producto.name,
        id: producto.id,
        cantidad: this.cantidad,
        precio: totalProducto,
      });

      this.calcularTotales();
      this.cantidad = 0;
      this.productoSeleccionado = this.productosDisponibles[0]?.id || '';
    }
  }

  eliminarProducto(index: number): void {
    this.productosAgregados.splice(index, 1);
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.cantidadTotal = this.productosAgregados.reduce(
      (sum, item) => sum + item.cantidad,
      0
    );
    this.precioTotal = this.productosAgregados.reduce(
      (sum, item) => sum + item.precio,
      0
    );
  }


  limpiarFormulario(): void {
    this.codigoSalida = '';
    this.fechaSalida = '';
    this.productosAgregados = [];
    this.cantidadTotal = 0;
    this.precioTotal = 0;
    this.notaSeleccionada = null;
  }
}
