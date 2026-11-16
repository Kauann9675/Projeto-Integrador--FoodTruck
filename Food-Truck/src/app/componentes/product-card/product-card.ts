import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FoodTruckService } from '../../Service/food-truck.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() produto: any;
  @Output() editar = new EventEmitter<any>();
  @Output() excluir = new EventEmitter<any>();

  constructor(public foodTruck: FoodTruckService) {}

  adicionar() { this.foodTruck.addToCart(this.produto); }
  verIngredientes() { this.foodTruck.openIngredients(this.produto); }
  editarProduto() { this.editar.emit(this.produto); }
  excluirProduto() { this.excluir.emit(this.produto); }
}
