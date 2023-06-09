import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Col } from "reactstrap";
import { Form, FormGroup, FormText, Input, Label, Alert } from "reactstrap";
import Select from "react-select";
import CodesService from "../../services/CodesService";
import ProductService from "../../services/ProductsService";
import qs from "query-string";
import GLOBAL from "../../constant";

const DEFAULT_CABINET_TYPE = "...Select";

class CodeForm extends Component {
    constructor(props) {
        super(props);
        this.err = "";
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
            products: [],
            submitPending: false,
        };
        this.users = new CodesService();
        this.productService = ProductService;
    }

    componentDidMount() {
        const { rtype, id } = this.props;
        if (rtype === "edit") {
            this.users.get(id).then((result) => {
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
        const { rtype, id, history } = this.props;
        const { code, description, width, depth, height, cabinet_type, product } = this.state;

        const updateCode = () => {
            this.setState({ submitPending: true });
            this.users
                .update(id, code, description, width, depth, height, cabinet_type, product)
                .then((res) => {
                    if (res.success === false) {
                        this.err = res.err;
                    } else {
                        history.replace("/codes");
                    }
                    this.setState({ show_msg: true });
                    this.alert_msg = res.msg;
                })
                .catch((err) => {
                    err.message.then((data) => {
                        alert("Issue occurred." + data);
                    });
                })
                .finally(() => {
                    this.setState({ submitPending: false });
                });
        };

        const addCode = () => {
            this.setState({ submitPending: true });
            this.users
                .add(code, description, width, depth, height, cabinet_type, product)
                .then((res) => {
                    if (res.success === false) {
                        this.err = res.err;
                    } else {
                        history.replace("/codes");
                    }
                    this.alert_msg = res.msg;
                    this.setState({ show_msg: true });
                })
                .catch((err) => {
                    err.message.then((data) => {
                        alert("Issue occurred." + data);
                    });
                })
                .finally(() => {
                    this.setState({ submitPending: false });
                });
        };

        if (rtype === "edit") {
            this.input_disabled = true;
            updateCode();
        } else {
            this.input_disabled = false;
            addCode();
        }

        return false;
    }

    handleChangeDropdown(type, e) {
        if (e != null) {
            this.setState({ [type]: e.value }, () => {
                console.log(type, this.state);
            });
        } else {
            this.setState({ [type]: DEFAULT_CABINET_TYPE });
        }
    }

    render() {
        const { rtype, submitPending } = this.props;
        const { products } = this.state;
        const cabinet_typeObj = GLOBAL.CABINETTYPE;
        const cabinet_type_opt = [];
        const default_type_opt = [];

        Object.keys(cabinet_typeObj).forEach(function(key) {
            var array = [];
            array = { value: key, label: cabinet_typeObj[key] };
            default_type_opt[key] = array;
            return cabinet_type_opt.push(array);
        });

        return (
            <Form
                method="post"
                encType="multipart/form-data"
                className="form-horizontal"
                onSubmit={this.handleSubmit.bind(this)}
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
                            onChange={this.handleChange.bind(this)}
                            defaultValue={this.state.code}
                        />
                        <span className="text-danger">{this.err ? this.err.code : ""}</span>
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
                            onChange={this.handleChange.bind(this)}
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
                            onChange={this.handleChange.bind(this)}
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
                            onChange={this.handleChange.bind(this)}
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
                            onChange={this.handleChange.bind(this)}
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
                                          const pr = products.find((product) => product.id === this.state.product);
                                          if (pr) {
                                              return { value: pr.id, label: pr.name };
                                          }
                                          return null;
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

                <Button type="submit" size="sm" color="primary" disabled={submitPending}>
                    <i className="fa fa-dot-circle-o" /> {submitPending ? "Pending..." : "Submit"}
                </Button>
            </Form>
        );
    }
}

/*
|--------------------------------------------------------------------------
| AddUpdate Component
|--------------------------------------------------------------------------
|
*/
export default class AddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rtype: qs.parse(this.props.location.search).type || "add",
            id: qs.parse(this.props.location.search).id || 0,
        };
    }

    render() {
        const { rtype, id } = this.state;
        return (
            <div className="animated fadeIn">
                <Col md="6">
                    <Card>
                        <CardHeader>
                            <strong>{rtype === "add" ? "Add Code" : "Edit Code"}</strong>
                        </CardHeader>
                        <CardBody>
                            <CodeForm rtype={rtype} id={id} history={this.props.history} />
                        </CardBody>
                    </Card>
                </Col>
            </div>
        );
    }
}
