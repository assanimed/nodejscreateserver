class OrderController {
  constructor(Order) {
    this.Order = Order;
  }

  async addOrder(OrderInfo) {
    await this.Order.create(OrderInfo);
  }

  async deleteOrder(id) {
    await this.Order.destroy({
      where: {
        email,
      },
    });
  }

  async getOrder(id) {
    return await this.Order.findOne({ where: { email } });
  }

  async getAllOrders() {
    return await this.Order.findAll();
  }
}

export default OrderController;
