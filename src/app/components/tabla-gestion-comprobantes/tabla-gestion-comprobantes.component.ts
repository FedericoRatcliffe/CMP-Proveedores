import { Component, effect, input, output, signal, SimpleChanges } from '@angular/core';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';


import { Product } from '../../paraTablaGestion/product.interface';
import { ProductService } from '../../paraTablaGestion/product.service';
import { SkeletonModule } from 'primeng/skeleton';




@Component({
  selector: 'tabla-gestion-comprobantes',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    SkeletonModule
  ],
  providers:[
    ProductService
  ],
  templateUrl: './tabla-gestion-comprobantes.component.html',
  styleUrl: './tabla-gestion-comprobantes.component.scss'
})

export class TablaGestionComprobantesComponent {
  products = input<Product[]>([]);
  selectedProducts = input<Product[] | null>(null);
  isLoading = input<boolean>(false);
  checkProduct = output<any>();
  loadingSkeletonArray: any[] = Array(5).fill({});

  constructor(public productService: ProductService) { }

  onCheckboxChange(event: any) {
    this.checkProduct.emit(event);
  }

}
