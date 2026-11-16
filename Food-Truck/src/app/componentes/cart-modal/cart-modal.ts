import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodTruckService } from '../../Service/food-truck.service';

@Component({
  selector: 'app-cart-modal',
  imports: [CommonModule],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css'
})
export class CartModal {
  constructor(public foodTruck: FoodTruckService) {}

  get itens() { return this.foodTruck.cart(); }
  calcularTotal(): number { return this.foodTruck.getTotal(); }
  fecharCarrinho() { this.foodTruck.cartOpen.set(false); }
  aumentarQuantidade(index: number) { this.foodTruck.increase(index); }
  diminuirQuantidade(index: number) { this.foodTruck.decrease(index); }
  removerProduto(index: number) { this.foodTruck.removeProduct(index); }

  finalizarPedido() {
    if (this.foodTruck.cart().length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }
    this.foodTruck.cartOpen.set(false);
    this.foodTruck.checkoutOpen.set(true);
  }
}
