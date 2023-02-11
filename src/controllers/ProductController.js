class ProductController {
  constructor(Product) {
    this.Product = Product;
  }

  async addProduct(ProductInfo) {
    await this.Product.create(ProductInfo);
  }

  async deleteProduct(email) {
    await this.Product.destroy({
      where: {
        email,
      },
    });
  }

  async getProduct(id) {
    return await this.Product.findOne({ where: { id } });
  }

  async getAllProducts() {
    return await this.Product.findAll();
  }
}

export default ProductController;
