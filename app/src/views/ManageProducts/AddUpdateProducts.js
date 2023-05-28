import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";

import ProductService from "../../services/ProductsService";
import CategoryService from "../../services/CategoriesService";

class AddUpdateProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            category_id: "",
            categories: [],
            redirectToProducts: false,
        };
        this.productService = ProductService;
        this.categoryService = CategoryService;
    }

    async componentDidMount() {
        await this.fetchCategories();

        const queryParams = new URLSearchParams(this.props.location.search);
        const type = queryParams.get("type");
        const id = queryParams.get("id");

        if (type === "edit" && id) {
            await this.fetchProduct(id);
        }
    }

    async fetchCategories() {
        try {
            const categories = await this.categoryService.getAllCategories();
            this.setState({ categories });
        } catch (error) {
            console.log("Failed to fetch categories:", error);
        }
    }

    async fetchProduct(id) {
        try {
            const product = await this.productService.getProductById(id);
            this.setState({
                name: product.name,
                category_id: product.category_id,
            });
        } catch (error) {
            console.log("Failed to fetch product:", error);
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { name, category_id } = this.state;

        const queryParams = new URLSearchParams(this.props.location.search);
        const type = queryParams.get("type");
        const id = queryParams.get("id");

        try {
            if (type === "edit" && id) {
                await this.productService.updateProduct(id, { name, category_id });
                console.log("Product updated successfully");
            } else {
                await this.productService.addProduct({ name, category_id });
                console.log("Product added successfully");
            }
            this.setState({ redirectToProducts: true });
        } catch (error) {
            console.log("Failed to add/update product:", error);
        }
    };

    render() {
        const { name, category_id, redirectToProducts, categories } = this.state;

        if (redirectToProducts) {
            return <Redirect to="/products" />;
        }

        return (
            <div className="animated fadeIn">
                <Col md="6">
                    <Card>
                        <CardHeader>
                            <strong>
                                {this.props.location.search.includes("type=edit") ? "Update Product" : "Add Product"}
                            </strong>
                        </CardHeader>

                        <CardBody>
                            <Form
                                method="post"
                                encType="multipart/form-data"
                                className="form-horizontal"
                                onSubmit={this.handleSubmit}
                            >
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="name">Name:</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder=""
                                            onChange={this.handleChange}
                                            value={name}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="category">Category:</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="select"
                                            id="category"
                                            name="category_id"
                                            onChange={this.handleChange}
                                            value={category_id}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </FormGroup>
                                <Button type="submit" size="sm" color="primary">
                                    <i className="fa fa-dot-circle-o" />{" "}
                                    {this.props.location.search.includes("type=edit") ? "Update" : "Add"}
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </div>
        );
    }
}

export default AddUpdateProducts;
