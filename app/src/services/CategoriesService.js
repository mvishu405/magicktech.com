class CategoriesService {
    constructor() {
        // Initialize dummy categories
        this.categories = [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }, { id: 3, name: "Category 3" }];
    }

    async getAllCategories() {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
        console.log(data);
        return data.map((todo) => ({ id: todo.id, name: todo.title }));
    }

    getCategoryById(id) {
        return this.categories.find((category) => category.id === id);
    }

    addCategory(category) {
        const newCategory = { id: Date.now(), ...category };
        this.categories.push(newCategory);
        return newCategory;
    }

    updateCategory(id, updatedCategory) {
        const index = this.categories.findIndex((category) => category.id === id);
        if (index !== -1) {
            this.categories[index] = { id, ...updatedCategory };
            return true;
        }
        return false;
    }

    deleteCategory(id) {
        const index = this.categories.findIndex((category) => category.id === id);
        if (index !== -1) {
            this.categories.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default CategoriesService;
