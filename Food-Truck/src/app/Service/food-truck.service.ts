import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FoodTruckService {
  products = signal<any[]>([
    {
      name: 'X-Burger Artesanal',
      price: 28.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000',
      description: 'Hambúrguer artesanal 180g, queijo cheddar, alface, tomate e molho especial',
      ingredients: ['Queijo cheddar', 'Alface', 'Tomate', 'Molho especial']
    },
    {
      name: 'X-Bacon Deluxe',
      price: 32.90,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000',
      description: 'Hambúrguer 180g, bacon crocante, cheddar, cebola caramelizada e barbecue',
      ingredients: ['Bacon', 'Cheddar', 'Cebola caramelizada', 'Barbecue']
    },
    {
      name: 'Pizza Margherita',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000',
      description: 'Molho de tomate, mussarela de búfala, manjericão fresco e azeite',
      ingredients: ['Mussarela', 'Manjericão', 'Azeite']
    },
    {
      name: 'Pizza especial',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000',
      description: 'Molho de tomate, mussarela, pepperoni e orégano',
      ingredients: ['Pepperoni', 'Mussarela', 'Orégano']
    },
    {
      name: 'Batata Frita Suprema',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1000',
      description: 'Batatas fritas crocantes com temperos especiais e molhos à escolha',
      ingredients: ['Cheddar', 'Bacon', 'Molho especial']
    },
    {
      name: 'Batata Rústica',
      price: 18.00,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000',
      description: 'Batatas rústicas com casca, alecrim e parmesão',
      ingredients: ['Alecrim', 'Parmesão']
    }
  ]);

  cart = signal<any[]>([]);
  orders = signal<any[]>([]);

  cartOpen = signal(false);
  ordersOpen = signal(false);
  checkoutOpen = signal(false);
  ingredientsOpen = signal(false);

  selectedProduct = signal<any>(null);
  productFormOpen = signal(false);
  editingProduct = signal<any>(null);
  removedIngredients = signal<string[]>([]);

  constructor() {
    // Mantém os produtos cadastrados pelo dono mesmo após atualizar a página.
    try {
      const saved = localStorage.getItem('street-food-truck-products');
      if (saved) this.products.set(JSON.parse(saved));
    } catch (error) {
      console.warn('Não foi possível carregar os produtos salvos.', error);
    }
  }

  private saveProducts() {
    try {
      localStorage.setItem('street-food-truck-products', JSON.stringify(this.products()));
    } catch (error) {
      console.warn('Não foi possível salvar os produtos.', error);
    }
  }

  openNewProduct() {
    this.editingProduct.set(null);
    this.productFormOpen.set(true);
  }

  openEditProduct(product: any) {
    this.editingProduct.set(product);
    this.productFormOpen.set(true);
  }

  saveProduct(data: any) {
    const ingredients = Array.isArray(data.ingredients)
      ? data.ingredients
      : String(data.ingredients || '').split(',').map((item: string) => item.trim()).filter(Boolean);
    const product = {
      name: String(data.name || '').trim(),
      price: Number(data.price),
      image: String(data.image || '').trim(),
      description: String(data.description || '').trim(),
      ingredients
    };

    if (!product.name || !Number.isFinite(product.price) || product.price < 0) return false;

    const editing = this.editingProduct();
    if (editing) {
      this.products.update(list => list.map(p => (p === editing ? { ...p, ...product } : p)));
    } else {
      this.products.update(list => [...list, product]);
    }

    this.saveProducts();
    this.cancelProductForm();
    return true;
  }

  deleteProduct(product: any) {
    this.products.update(list => list.filter(p => p !== product));
    this.saveProducts();
  }

  cancelProductForm() {
    this.productFormOpen.set(false);
    this.editingProduct.set(null);
  }

  addToCart(product: any) {
    const removed = [...(product.removed || [])];
    const key = JSON.stringify(removed);

    this.cart.update(cart => {
      const index = cart.findIndex(item =>
        item.name === product.name && JSON.stringify(item.removed) === key
      );
      if (index >= 0) {
        return cart.map((item, i) => (i === index ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...cart, { ...product, quantity: 1, removed }];
    });
    product.removed = [];
  }

  increase(index: number) {
    this.cart.update(cart =>
      cart.map((item, i) => (i === index ? { ...item, quantity: item.quantity + 1 } : item))
    );
  }

  decrease(index: number) {
    this.cart.update(cart => {
      const item = cart[index];
      if (!item) return cart;
      if (item.quantity > 1) {
        return cart.map((it, i) => (i === index ? { ...it, quantity: it.quantity - 1 } : it));
      }
      return cart.filter((_, i) => i !== index);
    });
  }

  removeProduct(index: number) {
    this.cart.update(cart => cart.filter((_, i) => i !== index));
  }

  getTotal(): number {
    return this.cart().reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getCount(): number {
    return this.cart().reduce((count, item) => count + item.quantity, 0);
  }

  openIngredients(product: any) {
    this.selectedProduct.set(product);
    this.removedIngredients.set([...(product.removed || [])]);
    this.ingredientsOpen.set(true);
  }

  toggleIngredient(ingredient: string, checked: boolean) {
    this.removedIngredients.update(list => {
      if (checked) return list.includes(ingredient) ? list : [...list, ingredient];
      return list.filter(item => item !== ingredient);
    });
  }

  confirmIngredients() {
    const product = this.selectedProduct();
    if (product) product.removed = [...this.removedIngredients()];
    this.ingredientsOpen.set(false);
  }

  addOrder(order: any) {
    this.orders.update(list => [...list, order]);
  }
}
