import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import ProductService from "../../services/ProductsService";
import CategoryService from "../../services/CategoriesService";

class ManageProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            categories: [],
            products: [],
            user: JSON.parse(localStorage.getItem("userData")),
        };
        this.productService = ProductService;
        this.categoryService = CategoryService;
    }

    componentDidMount() {
        Promise.all([this.fetchCategories(), this.fetchProducts()]);
    }

    async fetchCategories() {
        try {
            const categories = await this.categoryService.getAllCategories();
            this.setState({ categories, loading: false });
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    }

    async fetchProducts() {
        try {
            const products = await this.productService.getAllProducts();
            this.setState({ products, loading: false });
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    }

    handleDeleteProduct(id) {
        confirmAlert({
            title: "Confirm Delete",
            message: "Are you sure you want to delete this product?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        this.deleteProduct(id);
                    },
                },
                {
                    label: "No",
                    onClick: () => {
                        // Do nothing
                    },
                },
            ],
        });
    }

    async deleteProduct(id) {
        try {
            await this.productService.deleteProduct(id);
            await this.fetchProducts();
            console.log("Delete product with id:", id);
        } catch (error) {
            console.log("Error deleting product:", error);
        }
    }

    renderCategoryName(category, categories) {
        if (category) {
            let categoryName = category.name;
            let parentCategory = categories.find((cat) => cat.id === category.parent_id);
            while (parentCategory) {
                categoryName = parentCategory.name + " => " + categoryName;
                parentCategory = categories.find((cat) => cat.id === parentCategory.parent_id);
            }
            return categoryName;
        }
        return "";
    }

    render() {
        if (this.state.user.user_type !== "SA") {
            return <Redirect to={"/customers"} />;
        }

        const { products, loading, categories } = this.state;

        const columns = [
            {
                Header: "Id",
                id: "id",
                maxWidth: 60,
                accessor: "id",
                filterable: false,
                className: "text-center",
            },
            {
                Header: "Name",
                id: "name",
                accessor: "name",
            },
            {
                Header: "Category",
                id: "category",
                accessor: (d) => {
                    const category = categories.find((cat) => cat.id === d.category_id);
                    return this.renderCategoryName(category, categories);
                },
            },
            {
                Header: "Action",
                id: "action",
                maxWidth: 120,
                className: "text-center",
                filterable: false,
                accessor: (d) => (
                    <span>
                        <Link
                            to={"/products/edit/?type=edit&id=" + d.id}
                            className="btn btn-ghost-info mr10 action_btn"
                        >
                            <i className="fa fa-edit" title="Edit" />
                        </Link>
                        <div onClick={() => this.handleDeleteProduct(d.id)} className="btn btn-ghost-danger action_btn">
                            <Link to={"/products/" + d.id} title="Delete" className="color_red">
                                <i className="fa fa-trash" />
                            </Link>
                        </div>
                    </span>
                ),
            },
        ];

        return (
            <div className="react_table animated fadeIn">
                <Row className="align-items-center">
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify" /> Products List
                                <Link to="/products/add">
                                    <Button outline color="primary" className="float-right">
                                        Add Products
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    columns={columns}
                                    data={products}
                                    loading={loading}
                                    filterable
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                    loadingText="Loading..."
                                    style={{ height: "650px" }}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ManageProducts;
