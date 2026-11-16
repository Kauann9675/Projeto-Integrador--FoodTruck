import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodTruckService } from '../../Service/food-truck.service';

@Component({
  selector: 'app-modal-overlay',
  imports: [CommonModule],
  templateUrl: './modal-overlay.html',
  styleUrl: './modal-overlay.css'
})
export class ModalOverlay {
  constructor(public foodTruck: FoodTruckService) {}

  fechar() { this.foodTruck.ingredientsOpen.set(false); }

  selecionarIngrediente(ingrediente: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.foodTruck.toggleIngredient(ingrediente, checked);
  }

  confirmar() { this.foodTruck.confirmIngredients(); }
}
