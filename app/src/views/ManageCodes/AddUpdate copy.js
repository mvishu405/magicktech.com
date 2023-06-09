import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Col } from "reactstrap";
import { Form, FormGroup, FormText, Input, Label, Alert } from "reactstrap";
import CodesService from "../../services/CodesService";
import Select from "react-select";
import ProductService from "../../services/ProductsService";

const GLOBAL = require("../../constant");
const qs = require("query-string");

class AddUpdate extends Component {
    constructor(props) {
        super(props);
        this.alert_msg = "-";
        this.err = "";
        this.input_disabled = false;
        this.state = {
            code: "",
            description: "",
            width: "",
            depth: "",
            height: "",
            cabinet_type: "",
            date_created: "",
            date_modified: "",
            show_msg: false,
            product: null,
            products: [], // Holds the list of products
        };
        this.rtype = "add";
        this.id = 0;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.users = new CodesService();
        this.productService = ProductService;
    }

    componentDidMount() {
        this.rtype = qs.parse(this.props.location.search).type || "add";
        this.id = qs.parse(this.props.location.search).id || 0;

        if (this.rtype === "edit") {
            this.input_disabled = "true";
            this.users.get(this.id).then((result) => {
                result = result.data;
                this.setState({
                    code: result.code,
                    description: result.description,
                    width: result.width,
                    depth: result.depth,
                    height: result.height,
                    cabinet_type: result.cabinet_type,
                    product: result.product_id ? result.product_id : null,
                });
            });
        }
        // Fetch all products
        this.fetchProducts();
    }

    async fetchProducts() {
        try {
            const products = await this.productService.getAllProducts();
            this.setState({ products });
        } catch (error) {
            console.log("Failed to fetch products:", error);
        }
    }

    handleChange(e) {
        this.setState({ show_msg: false });
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.rtype === "edit") {
            this.input_disabled = true;
            this.users
                .update(
                    this.id,
                    this.state.code,
                    this.state.description,
                    this.state.width,
                    this.state.depth,
                    this.state.height,
                    this.state.cabinet_type,
                    this.state.product
                )
                .then((res) => {
                    if (res.success == false) {
                        this.err = res.err;
                    } else {
                        this.props.history.replace("/codes");
                    }
                    this.setState({ show_msg: true });
                    this.alert_msg = res.msg;
                })
                .catch((err) => {
                    err.message.then((data) => {
                        alert("Issue occurred." + data);
                    });
                });
        } else {
            this.input_disabled = false;
            this.users
                .add(
                    this.state.code,
                    this.state.description,
                    this.state.width,
                    this.state.depth,
                    this.state.height,
                    this.state.cabinet_type,
                    this.state.product
                )
                .then((res) => {
                    if (res.success == false) {
                        this.err = res.err;
                    } else {
                        this.props.history.replace("/codes");
                    }
                    this.alert_msg = res.msg;
                    this.setState({ show_msg: true });
                })
                .catch((err) => {
                    err.message.then((data) => {
                        alert("Issue occurred." + data);
                    });
                });
        }
        return false;
    }

    handleChangeDropdown(type, e) {
        if (e != null) {
            this.setState({ [type]: e.value }, () => {
                console.log(type, this.state);
            });
        } else {
            this.setState({ [type]: "...Select" });
        }
    }

    render() {
        const cabinet_typeObj = GLOBAL.CABINETTYPE;
        const cabinet_type_opt = [];
        const default_type_opt = [];
        Object.keys(cabinet_typeObj).forEach(function(key) {
            var array = [];
            array = { value: key, label: cabinet_typeObj[key] };
            default_type_opt[key] = array;
            return cabinet_type_opt.push(array);
        });

        console.log(`64565464565464554654`, default_type_opt);

        const { products } = this.state; // Get the list of products

        console.log(`PRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR`, this.state.product);

        return (
            <div className="animated fadeIn">
                <Col md="6">
                    <Card>
                        <CardHeader>
                            <strong>{this.rtype === "add" ? "Add Code" : "Edit Code"}</strong>
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
                                        <Label htmlFor="text-input">Code</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="text"
                                            id="code"
                                            name="code"
                                            placeholder=""
                                            onChange={this.handleChange}
                                            defaultValue={this.state.code}
                                        />
                                        <span className="text-danger">{this.err.code}</span>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Description</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="text"
                                            id="description"
                                            name="description"
                                            placeholder=""
                                            onChange={this.handleChange}
                                            defaultValue={this.state.description}
                                        />
                                        <span className="text-danger">{this.err.description}</span>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Width</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="number"
                                            id="width"
                                            name="width"
                                            placeholder=""
                                            onChange={this.handleChange}
                                            defaultValue={this.state.width}
                                        />
                                        <span className="text-danger">{this.err.width}</span>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Depth</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="number"
                                            id="depth"
                                            name="depth"
                                            placeholder=""
                                            onChange={this.handleChange}
                                            defaultValue={this.state.depth}
                                        />
                                        <span className="text-danger">{this.err.depth}</span>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Height</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="number"
                                            id="height"
                                            name="height"
                                            placeholder=""
                                            onChange={this.handleChange}
                                            defaultValue={this.state.height}
                                        />
                                        <span className="text-danger">{this.err.height}</span>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Cabinet Type</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Select
                                            isClearable
                                            name="cabinet_type"
                                            id="cabinet_type"
                                            value={default_type_opt[this.state.cabinet_type]}
                                            onChange={this.handleChangeDropdown.bind(this, "cabinet_type")}
                                            options={cabinet_type_opt}
                                        />
                                        <span className="text-danger">{this.err.cabinet_type}</span>
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Product</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Select
                                            isClearable
                                            name="product"
                                            id="product"
                                            value={
                                                this.state.product
                                                    ? (() => {
                                                          const pr = products.find(
                                                              (product) => product.id === this.state.product
                                                          );
                                                          return { value: pr.id, label: pr.name };
                                                      })()
                                                    : null
                                            }
                                            onChange={this.handleChangeDropdown.bind(this, "product")}
                                            options={products.map((product) => ({
                                                value: product.id,
                                                label: product.name,
                                            }))}
                                        />
                                    </Col>
                                </FormGroup>

                                <Button type="submit" size="sm" color="primary">
                                    <i className="fa fa-dot-circle-o" /> Submit
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                    <div style={this.state.show_msg ? {} : { display: "none" }}>
                        <Alert color="success">{this.alert_msg}</Alert>
                    </div>
                </Col>
            </div>
        );
    }
}

export default AddUpdate;
