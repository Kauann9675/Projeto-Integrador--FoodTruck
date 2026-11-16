import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodTruckService } from '../../Service/food-truck.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  form = this.emptyForm();

  constructor(public foodTruck: FoodTruckService) {}

  private emptyForm() {
    return { name: '', price: 0, image: '', description: '', ingredients: '' };
  }

  novoProduto() {
    this.form = this.emptyForm();
    this.foodTruck.openNewProduct();
  }

  editarProduto(produto: any) {
    this.form = {
      name: produto.name,
      price: produto.price,
      image: produto.image,
      description: produto.description,
      ingredients: (produto.ingredients || []).join(', ')
    };
    this.foodTruck.openEditProduct(produto);
  }

  salvarProduto() {
    if (!this.form.name.trim() || this.form.price < 0 || this.form.price === null || this.form.price === undefined) {
      alert('Informe o nome e um preço válido para o produto.');
      return;
    }
    if (this.foodTruck.saveProduct(this.form)) this.form = this.emptyForm();
  }

  excluirProduto(produto: any) {
    if (confirm(`Deseja realmente excluir o produto "${produto.name}"?`)) {
      this.foodTruck.deleteProduct(produto);
    }
  }

  cancelarEdicao() {
    this.foodTruck.cancelProductForm();
    this.form = this.emptyForm();
  }
}
