const GLOBAL = require("../constant");

class CategoriesService {
    constructor(domain) {
        if (CategoriesService.instance) {
            return CategoriesService.instance;
        }
        this.domain = domain || GLOBAL.BASE_URL;
        this.baseHeaders = {
            origin: ["*"],
            authorization: JSON.parse(localStorage.getItem("token")),
        };
        CategoriesService.instance = this;
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

    async getAllCategories() {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/categories/lists`;
        const options = { headers };

        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to fetch categories");
        }
    }

    async getCategoryById(id) {
        const categories = await this.getAllCategories();
        return categories.find((category) => category.id === id);
    }

    async addCategory(category) {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/categories/add`;
        const options = {
            method: "POST",
            headers: {
                ...headers,
            },
            crossDomain: true,
            body: JSON.stringify(category),
        };

        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to fetch categories");
        }
    }

    async updateCategory(id, updatedCategory) {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/categories/update`;
        const options = {
            method: "POST",
            headers: {
                ...headers,
            },
            crossDomain: true,
            body: JSON.stringify({ ...updatedCategory, id }),
        };
        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to fetch categories");
        }
    }

    async deleteCategory(id) {
        const headers = this.baseHeaders;
        const url = `${this.domain}api/v2/categories/delete/${id}`;
        const options = { headers };

        try {
            const data = await this.request(url, options);
            return data.data;
        } catch (error) {
            throw new Error("Failed to fetch categories");
        }
    }
}

// Create a single instance of the service
const categoriesServiceInstance = new CategoriesService();

// Export the singleton instance
export default categoriesServiceInstance;
