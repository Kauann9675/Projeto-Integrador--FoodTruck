import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodTruckService } from '../../Service/food-truck.service';

@Component({
  selector: 'app-orders-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-modal.html',
  styleUrl: './orders-modal.css'
})
export class OrdersModal {
  filtro = 'recent';
  constructor(public foodTruck: FoodTruckService) {}

  get orders() {
    const sorted = [...this.foodTruck.orders()];
    if (this.filtro === 'recent') sorted.reverse();
    if (this.filtro === 'az') sorted.sort((a, b) => a.customer.localeCompare(b.customer));
    if (this.filtro === 'payment') sorted.sort((a, b) => a.payment.localeCompare(b.payment));
    return sorted;
  }

  closeOrders() { this.foodTruck.ordersOpen.set(false); }
}
