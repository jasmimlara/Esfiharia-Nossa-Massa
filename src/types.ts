export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'salgadas' | 'doces' | 'bebidas' | 'combos';
}

export interface CartItem extends MenuItem {
  quantity: number;
}
