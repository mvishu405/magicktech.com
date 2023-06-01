import React, { Component } from "react";
import CategoriesService from "../../services/CategoriesService";
import { Redirect } from "react-router-dom";
import { Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";

class AddUpdateCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            parentCategoryId: null,
            parentCategories: [],
            redirectToCategories: false,
        };
        this.categoriesService = CategoriesService;
    }

    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const type = queryParams.get("type");
        const id = queryParams.get("id");

        if (type === "edit" && id) {
            this.fetchCategory(id);
        } else {
            this.fetchParentCategories();
        }
    }

    async fetchCategory(id) {
        try {
            const category = await this.categoriesService.getCategoryById(id);
            this.setState({
                name: category.name,
                parentCategoryId: category.parent_id,
            });
            await this.fetchParentCategories();
        } catch (error) {
            console.log("Failed to fetch category:", error);
        }
    }

    async fetchParentCategories() {
        try {
            const categories = await this.categoriesService.getAllCategories();
            const parentCategories = categories.filter((category) => category.parent_id === null);
            this.setState({ parentCategories });
        } catch (error) {
            console.log("Failed to fetch parent categories:", error);
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { name, parentCategoryId } = this.state;
        const queryParams = new URLSearchParams(this.props.location.search);
        const type = queryParams.get("type");
        const id = queryParams.get("id");

        try {
            if (type === "edit" && id) {
                await this.categoriesService.updateCategory(id, { name, parent_id: parentCategoryId });
                console.log("Category updated successfully");
            } else {
                await this.categoriesService.addCategory({ name, parent_id: parentCategoryId });
                console.log("Category added successfully");
            }
            this.setState({ redirectToCategories: true });
        } catch (error) {
            console.log("Failed to add/update category:", error);
        }
    };

    render() {
        const { name, parentCategoryId, redirectToCategories, parentCategories } = this.state;

        if (redirectToCategories) {
            return <Redirect to="/categories" />;
        }

        return (
            <div className="animated fadeIn">
                <Col md="6">
                    <Card>
                        <CardHeader>
                            <strong>
                                {this.props.location.search.includes("type=edit") ? "Update Category" : "Add Category"}
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
                                        <Label htmlFor="parentCategory">Parent Category:</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="select"
                                            id="parentCategory"
                                            name="parentCategoryId"
                                            onChange={this.handleChange}
                                            value={parentCategoryId ? parentCategoryId : ""}
                                        >
                                            <option value="">Select Parent Category</option>
                                            {this.props.location.search.includes("type=edit") &&
                                                parentCategories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            {!this.props.location.search.includes("type=edit") &&
                                                parentCategories.map((category) => (
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

export default AddUpdateCategories;
