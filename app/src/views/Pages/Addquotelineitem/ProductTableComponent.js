import React from "react";
import { Table } from "reactstrap";
import ProductRow from "./ProductRowComponent";

export default class ProductTable extends React.Component {
    render() {
        var accessories = this.props.accessories;
        var components = this.props.components;
        var codes = this.props.codes;
        var hide_model = this.props.hide_model;
        var onProductTableUpdate = this.props.onProductTableUpdate;
        var rowDel = this.props.onRowDel;
        var rowClone = this.props.onRowClone;
        var filterText = this.props.filterText;
        var sno = 1;
        const quoteFormData = this.props.quoteFormData;
        const quoteLineItems = quoteFormData.quoteLineItems.map((quoteLineItem) => {
            return (
                <ProductRow
                    // hide_model={hide_model}
                    // accessories={accessories}
                    // components={components}
                    // codes={codes}
                    // onProductTableUpdate={onProductTableUpdate}
                    // product={product}
                    // onDelEvent={rowDel.bind(this)}
                    // onCloneEvent={rowClone.bind(this)}
                    /**
                     * Events
                     */
                    onCategoryChange={this.props.onCategoryChange}
                    onSubCategoryChange={this.props.onSubCategoryChange}
                    onProductChange={this.props.onProductChange}
                    /**
                     * Data
                     */
                    quoteLineItem={quoteLineItem}
                    categories={this.props.categories}
                    subCategories={this.props.subCategories}
                    products={this.props.products}
                    codes={this.props.codes}
                    key={quoteLineItem.id}
                    sno={sno++}
                />
            );
        });

        return (
            <div className="animated fadeIn">
                <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right px-4 wa">
                    Add Cabinet
                </button>
                <Table border="2" hover className="table-outline mb-0 d-none d-sm-table bg_white quote_table">
                    <thead className="thead-light">
                        <tr>
                            <th>S.No</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Product</th>
                            <th>Code</th>
                            <th>Carcass</th>
                            <th>Shutter</th>
                            <th>Hinges</th>
                            <th>Drawers</th>
                            <th>Handles</th>
                            <th>Flap Up</th>

                            <th>Qty</th>

                            <th className="text-center" title="Accessories / Clone / Delete">
                                A / C / D
                            </th>
                        </tr>
                    </thead>
                    <tbody>{quoteLineItems}</tbody>
                </Table>
            </div>
        );
    }
}
