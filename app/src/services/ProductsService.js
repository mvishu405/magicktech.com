const GLOBAL = require("../constant");

class ProductService {
    constructor(domain) {
        if (ProductService.instance) {
            return ProductService.instance;
        }
        this.domain = domain || GLOBAL.BASE_URL;
        this.baseHeaders = {
            origin: ["*"],
            authorization: JSON.parse(localStorage.getItem("token")),
        };
        ProductService.instance = this;
    }

    async request(url, options) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Request failed");
            }
            return await response.json();
        } catch (error) {
            throw new Error("Request failed");
        }
    }

    async getAllProducts() {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/products/lists`;
        const options = { headers };

        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to fetch products");
        }
    }

    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find((product) => product.id === id);
    }

    async addProduct(product) {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/products/add`;
        const options = {
            method: "POST",
            headers: {
                ...headers,
            },
            crossDomain: true,
            body: JSON.stringify(product),
        };

        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to add product");
        }
    }

    async updateProduct(id, updatedProduct) {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/products/update`;
        const options = {
            method: "POST",
            headers: {
                ...headers,
            },
            crossDomain: true,
            body: JSON.stringify({ ...updatedProduct, id }),
        };
        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to update product");
        }
    }

    async deleteProduct(id) {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/products/delete/${id}`;
        const options = { headers };

        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to delete product");
        }
    }
}

// Create a single instance of the service
const productServiceInstance = new ProductService();

// Export the singleton instance
export default productServiceInstance;
