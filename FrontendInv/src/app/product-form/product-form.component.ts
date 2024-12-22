import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = this.createEmptyProduct();
  selectedProduct: Product | null = null;

  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  createEmptyProduct(): Product {
    if (!this.products || this.products.length === 0) {
      // Si los productos aún no han sido cargados, retorna un valor predeterminado
      return {
        ProductID: 'LB010',
        Description: '',
        Quantity: 0,
        LastPrice: 0,
        Category: '',
        Name: '',
      };
    }
  
    return {
      ProductID: this.generateNextProductCode(), // Genera automáticamente el código
      Description: '',
      Quantity: 0,
      LastPrice: 0,
      Category: '',
      Name: '',
    };
  }

  generateNextProductCode(): string {
    const prefix = 'LB';
    let maxNumber = 0;

    // Encuentra el número máximo del código actual
    this.products.forEach(product => {
      const codeNumber = parseInt(product.ProductID.replace(prefix, ''), 10);
      if (!isNaN(codeNumber) && codeNumber > maxNumber) {
        maxNumber = codeNumber;
      }
    });

    // Genera el siguiente código
    const nextNumber = maxNumber + 1;
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        console.log('Productos cargados:', this.products);
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  onSubmit(): void {
    this.productService.createProduct(this.product).subscribe({
      next: (response) => {
        console.log('Producto creado:', response);
        this.loadProducts();
        this.closeModal();
      },
      error: (err) => console.error('Error al crear producto:', err),
    });
  }

  openCreateModal(): void {
    this.product = this.createEmptyProduct();
    const modalElement = document.getElementById('productModal') as HTMLElement;
    if (modalElement) {
      modalElement.style.display = 'block';
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('productModal') as HTMLElement;
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  }
}
