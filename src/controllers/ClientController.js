class ClientController {
  constructor(Client) {
    this.Client = Client;
  }

  async addClient(clientInfo) {
    await this.Client.create(clientInfo);
  }

  async deleteClient(email) {
    await this.Client.destroy({
      where: {
        email,
      },
    });
  }

  async getClient(email) {
    return await this.Client.findOne({ where: { email } });
  }

  async getAllClients() {
    return await this.Client.findAll();
  }
}

export default ClientController;
