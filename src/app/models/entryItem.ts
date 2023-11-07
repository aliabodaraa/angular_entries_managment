export class EntryItem {
  $u_id: string = '';
  type: string = '';
  imageUrl: string = '';
  price: number = 0;
  quantity: number = 0;

  constructor(init?: Partial<EntryItem>) {
    Object.assign(this, init);
  }

  get totalPrice() {
    return this.price * this.quantity;
  }
}
