import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    CommonModule,
    DeleteConfirmationComponent,
    HeaderComponent,
    FormsModule,
    ProductFormComponent, 
   
  ],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})

export class ProductTableComponent implements OnInit {
  products: Product[] = []; 
  selectedItem: string = ''; 
  selectedProduct: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(); 
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data; 
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }
    

  editProduct(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (product: Product) => {
        console.log('Producto cargado para editar:', product);
        this.selectedProduct = product;
      },
      error: (err) => console.error('Error al cargar el producto:', err),
    });
  }

  onSubmitEdit(): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.ProductID, this.selectedProduct).subscribe({
        next: (updatedProduct: Product) => {
          console.log('Producto actualizado:', updatedProduct);
          this.loadProducts();
          this.selectedProduct = null; 
        },
        error: (err) => console.error('Error al actualizar producto:', err),
      });
    }
  }
  

  prepareDelete(item: string): void {
    if (item) {
      this.selectedItem = item;
    } else {
      console.error('No se ha seleccionado un producto para eliminar');
    }
  }
  
  onDeleteConfirmed(): void {
    if (this.selectedItem) {
      this.productService.deleteProduct(this.selectedItem).subscribe({
        next: () => {
          alert('Producto eliminado con éxito'); 
          this.loadProducts(); 
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('Error al eliminar el producto'); 
        },
      });
    }
  }
  
}
