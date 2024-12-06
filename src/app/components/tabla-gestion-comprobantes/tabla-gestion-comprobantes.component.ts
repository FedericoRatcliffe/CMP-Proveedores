import { Component } from '@angular/core';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';


import { Product } from '../../paraTablaGestion/product';
import { ProductService } from '../../paraTablaGestion/product.service';




@Component({
  selector: 'tabla-gestion-comprobantes',
  standalone: true,
  imports: [
    TableModule,
    TagModule
  ],
  providers:[
    ProductService
  ],
  templateUrl: './tabla-gestion-comprobantes.component.html',
  styleUrl: './tabla-gestion-comprobantes.component.scss'
})
export class TablaGestionComprobantesComponent {

  products!: Product[];

  selectedProducts!: Product;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProductsMini().then((data) => {
      this.products = data;
    });
  }





}
