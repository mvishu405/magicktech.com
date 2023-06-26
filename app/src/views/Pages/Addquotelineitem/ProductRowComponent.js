import React from "react";
import {
    ListGroup,
    ListGroupItem,
    Button,
    Col,
    Dropdown,
    FormGroup,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    Table,
    Input,
    Form,
    Label,
    Card,
    CardHeader,
    CardBody,
    Alert,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { Checkbox, CheckboxGroup } from "react-checkbox-group";
import Select from "react-select";

export default class ProductRow extends React.Component {
    onDelEvent() {
        this.props.onDelEvent(this.props.product);
    }
    onCloneEvent() {
        this.props.onCloneEvent(this.props.product.id, this.props.product);
    }
    render() {
        return (
            <tr className="text-center">
                <td className="del-cell" width="5%">
                    {this.props.sno}
                </td>
                <EditableCellCategory
                    categories={this.props.categories}
                    quoteLineItem={this.props.quoteLineItem}
                    onCategoryChange={this.props.onCategoryChange}
                />
                <EditableCellSubCategory
                    subCategories={this.props.subCategories}
                    quoteLineItem={this.props.quoteLineItem}
                    onSubCategoryChange={this.props.onSubCategoryChange}
                />
                <EditableCellProduct
                    products={this.props.products}
                    quoteLineItem={this.props.quoteLineItem}
                    onProductChange={this.props.onProductChange}
                />
                <EditableCellCode codes={this.props.codes} quoteLineItem={this.props.quoteLineItem} />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
            </tr>
        );
    }
}

class EditableCellCategory extends React.Component {
    render() {
        return (
            <td className="category">
                <select
                    className="form-control wa"
                    onChange={(e) => {
                        this.props.onCategoryChange(e.target.value, this.props.quoteLineItem.id);
                    }}
                >
                    <option value="">Select Category...</option>
                    {this.props.categories.map((x) => (
                        <option value={x.id} key={x.id}>
                            {x.name}
                        </option>
                    ))}
                </select>
            </td>
        );
    }
}

class EditableCellSubCategory extends React.Component {
    render() {
        return (
            <td className="subCategory">
                <select
                    className="form-control wa"
                    onChange={(e) => {
                        this.props.onSubCategoryChange(e.target.value, this.props.quoteLineItem.id);
                    }}
                >
                    <option value="">Select Sub Category...</option>
                    {this.props.subCategories.map((x) => (
                        <option value={x.id} key={x.id}>
                            {x.name}
                        </option>
                    ))}
                </select>
            </td>
        );
    }
}

class EditableCellProduct extends React.Component {
    render() {
        return (
            <td className="products">
                <select
                    className="form-control wa"
                    onChange={(e) => {
                        this.props.onProductChange(e.target.value, this.props.quoteLineItem.id);
                    }}
                >
                    <option value="">Select Products...</option>
                    {this.props.products.map((x) => (
                        <option value={x.id} key={x.id}>
                            {x.name}
                        </option>
                    ))}
                </select>
            </td>
        );
    }
}

class EditableCellCode extends React.Component {
    render() {
        return (
            <td className="codes">
                <select className="form-control wa">
                    <option value="">Select Codes...</option>
                    {this.props.codes.map((x) => (
                        <option value={x.id} key={x.id}>
                            {x.description}
                        </option>
                    ))}
                </select>
            </td>
        );
    }
}

class EditableCellQuantity extends React.Component {
    checkLength(e) {
        if (e.target.value > 20) {
            document.getElementById("quantity_" + e.target.id).className += " alert_err";
        } else {
            document.getElementById("quantity_" + e.target.id).classList.remove("alert_err");
        }
    }
    render() {
        return (
            <td
                id={"quantity_" + this.props.cellData.id}
                className="cabinet_quantity"
                width={this.props.cellData.width}
            >
                <span className="err">Max 20!</span>
                <input
                    min="1"
                    max="20"
                    maxLength="2"
                    style={{ height: "35px" }}
                    className="form-control qty_input"
                    type="number"
                    name={this.props.cellData.type}
                    id={this.props.cellData.id}
                    value={this.props.cellData.value}
                    onChange={this.props.onProductTableUpdate}
                    onInput={this.checkLength.bind(this)}
                />
            </td>
        );
    }
}
class EditableCellType extends React.Component {
    render() {
        return (
            <td width={this.props.cellData.width}>
                <select
                    type="select"
                    className="form-control wa"
                    name={this.props.cellData.type}
                    id={this.props.cellData.id}
                    value={this.props.cellData.value}
                    onChange={this.props.onProductTableUpdate}
                >
                    <option value="Base">Base</option>
                    <option value="Wall">Wall</option>
                    <option value="Tall">Tall</option>
                    <option value="Others">Others</option>
                </select>
            </td>
        );
    }
}
// class EditableCellCode extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             selectedOption: this.props.cellData.value,
//             getOption: [],
//             getCodes: [],
//         };
//     }

//     handleChange = (selectedOption) => {
//         if (selectedOption != null) {
//             this.setState({ selectedOption });
//             var array = {
//                 id: this.props.cellData.id,
//                 name: this.props.cellData.type,
//                 value: selectedOption.value,
//             };
//             var arr = { target: array };
//             this.props.onProductTableUpdate(arr);
//         } else {
//             this.setState({ selectedOption: "Sealect.." });
//         }
//     };

//     componentWillReceiveProps(nextProps) {
//         this.setState({ getCodes: this.props.codes });
//     }

//     render() {
//         let filter_code = this.props.codes.filter((type) => {
//             if (this.props.type == "Others") {
//                 return type.cabinet_type != "Base" && type.cabinet_type != "Wall" && type.cabinet_type != "Tall";
//             } else {
//                 return type.cabinet_type == this.props.type;
//             }
//         });

//         let codes = [];
//         filter_code.forEach(function(res, key) {
//             var array = {
//                 value: res.id,
//                 label: res.code + "-" + res.description,
//             };
//             codes[res.id] = array;
//         });

//         let defaultValue = "";
//         if (codes.length > 0 && codes != undefined && codes != null) {
//             if (codes[this.props.cellData.value] != undefined) {
//                 defaultValue = codes[this.props.cellData.value];
//             }
//         }

//         return (
//             <td className="select-up" width={this.props.cellData.width}>
//                 <Select
//                     backspaceRemoves
//                     isClearable
//                     className="menu-outer-top"
//                     name={this.props.cellData.type}
//                     id={this.props.cellData.id}
//                     value={defaultValue}
//                     onChange={this.handleChange}
//                     options={codes}
//                 />
//             </td>
//         );
//     }
// }
class EditableCellAcc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            selected: {},
            resetAcc: [],
            selectedAcc: {},
            hide_model: false,
            addClass: false,
        };
        this.tpacc = {};
        this.accfilter = this.accfilter.bind(this);
        this.toggle = this.toggle.bind(this);
        this.qtyChange = this.qtyChange.bind(this);
    }

    toggle() {
        if (this.props.cellData.value != "") {
            if (typeof this.props.cellData.value === "string") {
                this.setState({ selectedAcc: JSON.parse(this.props.cellData.value) });
                this.tpacc = JSON.parse(this.props.cellData.value);
            } else {
                if (this.props.cellData.value === null) {
                    this.setState({ selectedAcc: {} });
                    this.tpacc = {};
                } else {
                    this.setState({ selectedAcc: this.props.cellData.value });
                    this.tpacc = this.props.cellData.value;
                }
            }
        }
        this.setState({
            modal: !this.state.modal,
            hide_model: true,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ hide_model: nextProps.val > this.props.hide_model });
        if (this.state.hide_model == true) {
            this.setState({
                modal: false,
            });
        }
    }

    qtyChange(e) {
        var eid = e.target.id;
        var evalue = e.target.value;

        if (e.target.value != "") {
            if (evalue >= 6 || evalue <= 0) {
                document.getElementById("list_" + eid).className += " alert_err";
                document.getElementsByClassName("acc_update_btn")[0].setAttribute("disabled", "");
            } else {
                document.getElementsByClassName("acc_update_btn")[0].removeAttribute("disabled", "");
                document.getElementById("list_" + eid).classList.remove("alert_err");
                this.state.selectedAcc[eid] = evalue;
                this.setState({ selectedAcc: this.state.selectedAcc });
            }
        } else {
            document.getElementById("list_" + eid).classList.remove("alert_err");
            const acc = this.state.selectedAcc;
            const newAcc = Object.keys(acc).reduce((object, key) => {
                if (key !== eid) {
                    object[key] = acc[key];
                }
                return object;
            }, {});
            this.setState({ selectedAcc: newAcc });
        }
    }

    accfilter(accid) {
        if (this.state.selectedAcc != "" && this.state.selectedAcc != null) {
            if (this.state.selectedAcc[accid] != undefined) {
                return this.state.selectedAcc[accid];
            }
        }
    }

    render() {
        const selectedAcc = JSON.stringify(this.state.selectedAcc);
        return (
            <div style={{ display: "inline-block" }}>
                <div className="btn btn-ghost-success" onClick={this.toggle} value={this.state.selected}>
                    <i className="fa fa-plus" aria-hidden="true" />
                </div>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    backdrop="static"
                    keyboard={false}
                    className={"acc_model modal-lg "}
                >
                    <ModalHeader>
                        S.No-<span>{this.props.sno}</span> for Select Accessories
                        <div className="top_update_btn">
                            <Button
                                color="primary"
                                name={this.props.cellData.type}
                                id={this.props.cellData.id}
                                value={selectedAcc}
                                onClick={this.props.onProductTableUpdate}
                                className="acc_update_btn btn btn-success mr10"
                            >
                                Update
                            </Button>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <ListGroup>
                            <CheckboxGroup name="acc">
                                {this.props.accessories.map((option) => (
                                    <ListGroupItem
                                        key={option.id}
                                        id={"list_" + option.id}
                                        title={option.code + " - " + option.name}
                                    >
                                        <span className="err">Acceptable value only 1 to 5!</span>
                                        <Input
                                            id={option.id}
                                            onChange={this.qtyChange}
                                            defaultValue={this.accfilter(option.id)}
                                            type="number"
                                            min="1"
                                            max="5"
                                            className="mr10 acc_input"
                                        />{" "}
                                        {option.code} - {option.name.substr(0, 35)}
                                        {option.name.length > 35 ? " ..." : ""}
                                    </ListGroupItem>
                                ))}
                            </CheckboxGroup>
                        </ListGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Alert
                            className="m0"
                            color="success"
                            style={this.state.hide_model ? { display: "none" } : { display: "block" }}
                        >
                            Accessories Saved!
                        </Alert>
                        <Button
                            className="acc_update_btn"
                            color="primary"
                            type="text"
                            name={this.props.cellData.type}
                            id={this.props.cellData.id}
                            value={selectedAcc}
                            onClick={this.props.onProductTableUpdate}
                        >
                            Update
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
class EditableCell extends React.Component {
    render() {
        const options = this.props.components.filter((type) => type.component_type == this.props.cellData.c_type);
        return (
            <td width={this.props.cellData.width}>
                <select
                    type="select"
                    type="select"
                    className="form-control wa"
                    name={this.props.cellData.type}
                    id={this.props.cellData.id}
                    value={this.props.cellData.value}
                    onChange={this.props.onProductTableUpdate}
                >
                    <option value="31">NA</option>
                    {options.map((option) => (
                        <option key={option.id + option.component_name} value={option.id}>
                            {option.component_name}
                        </option>
                    ))}
                </select>
            </td>
        );
    }
}
