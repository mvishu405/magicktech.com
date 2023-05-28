import React, { Component } from "react";
import CategoriesService from "../../services/CategoriesService";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from "lodash";

class ManageCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            categories: [],
        };
        this.categoriesService = new CategoriesService();
    }

    async componentDidMount() {
        await this.fetchCategories();
    }

    async fetchCategories() {
        try {
            const categories = await this.categoriesService.getAllCategories();
            this.setState({ categories, loading: false });
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    }

    handleDeleteCategory(id) {
        // Implement the delete category logic here
        console.log("Delete category with id:", id);
    }

    render() {
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
