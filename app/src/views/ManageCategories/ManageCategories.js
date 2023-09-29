import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import categoriesServiceInstance from "../../services/CategoriesService";

class ManageCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            categories: [],
            user: JSON.parse(localStorage.getItem("userData")),
        };
        this.categoriesService = categoriesServiceInstance;
    }

    componentDidMount() {
        this.fetchCategories();
    }

    async fetchCategories() {
        try {
            let categories = await this.categoriesService.getAllCategories();
            categories = categories.sort((a, b) => b.id - a.id);
            this.setState({ categories, loading: false });
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    }

    handleDeleteCategory(id) {
        confirmAlert({
            title: "Confirm Delete",
            message: "Are you sure you want to delete this category?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        this.deleteCategory(id);
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

    async deleteCategory(id) {
        try {
            // Implement the delete category logic here
            await this.categoriesService.deleteCategory(id);
            await this.fetchCategories();
            console.log("Delete category with id:", id);
        } catch (error) {
            console.log("Error deleting category:", error);
        }
    }

    render() {
        if (this.state.user.user_type !== "SA") {
            return <Redirect to={"/customers"} />;
        }

        const { categories, loading } = this.state;

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
                Header: "Parent Category Id",
                id: "parent-category-id",
                accessor: "parent_id",
            },
            {
                Header: "Parent Category",
                id: "parent-category",
                accessor: "parent_id",
                filterMethod: (filter, row) => {
                    const parentCategory = categories.find((category) => category.id === row._original.parent_id);
                    return parentCategory && parentCategory.name.toLowerCase().includes(filter.value.toLowerCase());
                },
                Filter: ({ filter, onChange }) => (
                    <input
                        value={filter ? filter.value : ""}
                        onChange={(event) => onChange(event.target.value)}
                        style={{ width: "100%" }}
                    />
                ),
                Cell: ({ row }) => {
                    const parentCategory = categories.find((category) => category.id === row._original.parent_id);
                    return parentCategory ? parentCategory.name : "";
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
                            to={"/categories/edit/?type=edit&id=" + d.id}
                            className="btn btn-ghost-info mr10 action_btn"
                        >
                            <i className="fa fa-edit" title="Edit" />
                        </Link>
                        <div
                            onClick={() => this.handleDeleteCategory(d.id)}
                            className="btn btn-ghost-danger action_btn"
                        >
                            <Link to={"/categories/" + d.id} title="Delete" className="color_red">
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
                                <i className="fa fa-align-justify" /> Categories List
                                <Link to="/categories/add">
                                    <Button outline color="primary" className="float-right">
                                        Add Categories
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    columns={columns}
                                    data={categories}
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

export default ManageCategories;
