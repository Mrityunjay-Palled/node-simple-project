const fs = require("fs");
const http = require("http");
const url=require("url");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObject = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8"
);

const replaceTemplate = (tempCard, product) => {
  let output = tempCard.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const myServer = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardsHTML = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObject[query.id]
    const output = replaceTemplate(tempProduct,product)
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("Not Found");
  }
});

myServer.listen(3000, "127.0.0.1", () => {
  console.log("server listening on 3000");
});
