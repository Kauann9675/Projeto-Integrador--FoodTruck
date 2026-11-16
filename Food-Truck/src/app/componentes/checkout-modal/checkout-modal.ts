import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodTruckService } from '../../Service/food-truck.service';

@Component({
  selector: 'app-checkout-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-modal.html',
  styleUrl: './checkout-modal.css'
})
export class CheckoutModal {
  customer = '';
  cpf = '';
  payment = 'Cartão';
  consumption = 'Local';
  nome: String ="";

  constructor(public foodTruck: FoodTruckService) {}

  fechar() { this.foodTruck.checkoutOpen.set(false); }

  getTotal() { return this.foodTruck.getTotal(); }

  confirmarPedido() {
    if (!this.customer.trim()) {
      alert('Nome é obrigatório.');
      return;
    }
    if (this.foodTruck.cart().length === 0) {
      alert('Seu carrinho está vazio.');
      this.fechar();
      return;
    }

    const now = new Date();
    this.foodTruck.addOrder({
      customer: this.customer.trim(),
      cpf: this.cpf,
      payment: this.payment,
      consumption: this.consumption,
      products: [...this.foodTruck.cart()],
      total: this.foodTruck.getTotal(),
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR')
    });

    this.foodTruck.cart.set([]);
    this.customer = '';
    this.cpf = '';
    this.payment = 'Cartão';
    this.consumption = 'Local';
    this.foodTruck.checkoutOpen.set(false);
    alert('Pedido finalizado!');
  }
}
