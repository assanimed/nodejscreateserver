import http from "http";
import fs from "node:fs";
import { appendFile } from "node:fs/promises";
import { parse } from "querystring";
import url from "node:url";
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "./connection.js";

import { Order } from "./models/Order.js";
import { Client } from "./models/Client.js";
import { Product } from "./models/Product.js";
import ClientController from "./controllers/clientController.js";
import ProductController from "./controllers/ProductController.js";
import OrderController from "./controllers/OrderController.js";

const clientController = new ClientController(Client);
const productController = new ProductController(Product);
const orderController = new OrderController(Order);

const PORT = 7788;

const page = "index.html";

const addUser = async (user) => {
  try {
    await appendFile(
      "./user.txt",
      `username:${user.username},password:${user.password}\n`,

      { encoding: "utf8" }
    );
  } catch (err) {
    console.log(err);
  }
};

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    var { path } = url.parse(req.url, true);
    const { method } = req;

    console.log(path);

    const paths = path.split("/").filter((item) => item !== "");

    const target = paths[0];
    console.log(target);

    if (["product", "client", "order"].includes(target)) {
      if (target === "product") {
        if (paths.length === 1) {
          const allProducts = await productController.getAllProducts();
          res.write(`
            <a href="/product/addProduct">add new Product</a>
          
              <table border="2">
                  <tr>
                      <th>id</th>
                      <th>name</th>
                      <th>price</th>
                      <th>quantity</th>
                      <th>discount</th>
                  </tr>
          `);

          allProducts.forEach((product) => {
            res.write(`
              <tr>
                      <th>${product.dataValues.id}</th>
                      <th>${product.dataValues.name}</th>
                      <th>${product.dataValues.price}</th>
                      <th>${product.dataValues.quantity}</th>
                      <th>${product.dataValues.discount}</th>
                  </tr>            
              `);
          });

          res.write("</table>");
        } else {
          if (paths[1] === "addProduct") {
            if (method === "GET") {
              res.write(`
                      <form method="POST" taget="/client/addClient">
                          <div>
                              <label>name</label>
                              <input type="text" name="name" />
                          </div>
                          <div>
                              <label>price</label>
                              <input type="number" name="price" />
                          </div>
                          <div>
                              <label>quantity</label>
                              <input type="number" name="quantity" />
                          </div>
                          <div>
                              <label>discount</label>
                              <input type="text" name="discount" />
                          </div>
                          <div>
                              <input type="submit" name="submit" value="add" />
                          </div>
                      </form>
                  `);
            } else if (method === "POST") {
              //   console.log(req);
              req.on("data", async (data) => {
                const dataChunk = data
                  .toString()
                  .replace("%40", "@")
                  .replaceAll("+", " ")
                  .split("&")
                  .map((item) => ({
                    [item.split("=")[0]]: item.split("=")[1],
                  }))
                  .filter((item) => !item.hasOwnProperty("submit"))
                  .reduce((acc, next) => {
                    return { ...acc, ...next };
                  }, {});
                try {
                  await productController.addProduct(dataChunk);

                  console.log("Product ADDED");
                } catch (e) {
                  console.log("error", e);
                }
              });
              res.write(`
                      <h1>NEW Product HAS BEEN ADDED</h1>
                      <a href="/product">GO TO Products</a>
                  `);
            } else {
              res.writeHead(401);
              res.write("INVALID REQUEST");
            }
          } else {
            res.writeHead(404);
            res.write("Page Not Found");
          }
        }

        //
      }
      if (target === "client") {
        if (paths.length === 1) {
          console.log(true);
          const allClient = await clientController.getAllClients();
          res.write(`
          <a href="/client/addClient">add new Client</a>
        
            <table border="2">
                <tr>
                    <th>id</th>
                    <th>username</th>
                    <th>email</th>
                    <th>telephone</th>
                    <th>address</th>
                </tr>
        `);

          allClient.forEach((client) => {
            res.write(`
            <tr>
                    <th>${client.dataValues.id}</th>
                    <th>${client.dataValues.username}</th>
                    <th>${client.dataValues.email}</th>
                    <th>${client.dataValues.telephone}</th>
                    <th>${client.dataValues.address}</th>
                </tr>            
            `);
          });

          res.write("</table>");
        } else {
          if (paths[1] === "addClient") {
            if (method === "GET") {
              res.write(`
                
                    <form method="POST" taget="/client/addClient">
                        <div>
                            <label>username</label>
                            <input type="text" name="username" />
                        </div>
                        <div>
                            <label>name</label>
                            <input type="text" name="name" />
                        </div>
                        <div>
                            <label>email</label>
                            <input type="email" name="email" />
                        </div>
                        <div>
                            <label>address</label>
                            <input type="text" name="address" />
                        </div>
                        <div>
                            <label>telephone</label>
                            <input type="text" name="telephone" />
                        </div>
                        <div>
                            <input type="submit" name="submit" value="add" />
                        </div>
                    </form>
                
                `);
            } else if (method === "POST") {
              //   console.log(req);
              req.on("data", async (data) => {
                const dataChunk = data
                  .toString()
                  .replace("%40", "@")
                  .split("&")
                  .map((item) => ({
                    [item.split("=")[0]]: item.split("=")[1],
                  }))
                  .filter((item) => !item.hasOwnProperty("submit"))
                  .reduce((acc, next) => {
                    return { ...acc, ...next };
                  }, {});
                try {
                  const cl = await clientController.addClient(dataChunk);

                  console.log("USED ADDED");
                } catch (e) {
                  console.log("error", e);
                }
              });
              res.write(`
                    <h1>NEW CLIENT HAS BEEN ADDED</h1>
                    <a href="/client">GO TO CLIENT</a>
                `);
            } else {
              res.writeHead(401);
              res.write("INVALID REQUEST");
            }
          } else {
            res.writeHead(404);
            res.write("Page Not Found");
          }
        }
      }
      if (target === "order") {
        if (paths.length === 1) {
          console.log(true, "Main Order");
          const allOrder = await orderController.getAllOrders();
          console.log(allOrder);
          res.write(`
            <a href="/order/addOrder">add new Order</a>
          
              <table border="2">
                  <tr>
                      <th>id</th>
                      <th>product_id</th>
                      <th>client_id</th>
                      <th>quantity</th>
                      <th>status</th>
                  </tr>
          `);

          /* allClient.forEach((client) => {
            res.write(`
              <tr>
                      <th>${client.dataValues.id}</th>
                      <th>${client.dataValues.username}</th>
                      <th>${client.dataValues.email}</th>
                      <th>${client.dataValues.telephone}</th>
                      <th>${client.dataValues.address}</th>
                  </tr>            
              `);
          }); */

          res.write("</table>");
        } else {
          if (paths[1] === "addClient") {
            if (method === "GET") {
              res.write(`
                  
                      <form method="POST" taget="/client/addClient">
                          <div>
                              <label>username</label>
                              <input type="text" name="username" />
                          </div>
                          <div>
                              <label>name</label>
                              <input type="text" name="name" />
                          </div>
                          <div>
                              <label>email</label>
                              <input type="email" name="email" />
                          </div>
                          <div>
                              <label>address</label>
                              <input type="text" name="address" />
                          </div>
                          <div>
                              <label>telephone</label>
                              <input type="text" name="telephone" />
                          </div>
                          <div>
                              <input type="submit" name="submit" value="add" />
                          </div>
                      </form>
                  
                  `);
            } else if (method === "POST") {
              //   console.log(req);
              req.on("data", async (data) => {
                const dataChunk = data
                  .toString()
                  .replace("%40", "@")
                  .split("&")
                  .map((item) => ({
                    [item.split("=")[0]]: item.split("=")[1],
                  }))
                  .filter((item) => !item.hasOwnProperty("submit"))
                  .reduce((acc, next) => {
                    return { ...acc, ...next };
                  }, {});
                try {
                  const cl = await clientController.addClient(dataChunk);

                  console.log("USED ADDED");
                } catch (e) {
                  console.log("error", e);
                }
              });
              res.write(`
                      <h1>NEW CLIENT HAS BEEN ADDED</h1>
                      <a href="/client">GO TO CLIENT</a>
                  `);
            } else {
              res.writeHead(401);
              res.write("INVALID REQUEST");
            }
          } else {
            res.writeHead(404);
            res.write("Page Not Found");
          }
        }
      }
      res.end();
    } else {
      res.writeHead(404, "Not Found");
      res.write("Page Not Found");
      res.end();
    }

    /*if (path === "/adduser") {
      if (method === "POST") {
        let resData = "";
        req.on("data", (data) => {
          resData += data;
        });
        res.on("close", () => {
          const userInfo = parse(resData);

          addUser(userInfo);
        });
        res.write(`<h1>USER ADDED  </h1>`);
      } else {
        res.end(`
        
          <script>
          window.location.href = "/"
          </script>
        `);
      }
    }

    res.end();*/
  })
  .listen(PORT);

console.log(`Server running on port ${PORT}`);
console.log(`http://localhost:${PORT}`);
