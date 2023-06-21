import React, { Component } from "react";
import CustomersService from "../../../services/CustomersService";
import AccessoriesService from "../../../services/AccessoriesService";
import DesignerService from "../../../services/DesignerService";
import ComponentService from "../../../services/ComponentService";
import CodesService from "../../../services/CodesService";

import ProductService from "../../../services/ProductsService";
import CategoryService from "../../../services/CategoriesService";

import ProductTable from "./ProductTableComponent";
const qs = require("query-string");

export default class Addquotelineitem extends Component {
    constructor(props) {
        super(props);

        this.id = 0;
        this.qid = 0;

        this.state = {
            get_accessories: [],
            get_designer: [],
            get_dealer_details: [],
            get_quote_line_item: [],
            showpdflink: false,
            status: false,
            get_customer_details: [],
            select_codes_option: [],
            select_components_option: [],
            cabinet_discount: 0,
            accessories_discount: 0,
            square_feet: 300,
            show_cabinetprice: 0,
            quoteforname: "",
            mode_cq: false,
            service_rows: [{}],

            //
            loading: false,
            // this holds all the category data
            allCategory: [],
            //
            categoryList: [],
            subCategoryList: [],
            productList: [],
            codeList: [],

            // These have all the selected data
            quoteFormData: {
                quoteLineItems: [
                    {
                        id: 1,
                    },
                ],
            },
        };

        // Services
        this.get_customer = new CustomersService();
        this.productService = ProductService;
        this.categoryService = CategoryService;
        this.CodesService = new CodesService();
    }

    componentDidMount() {
        this.id = parseInt(qs.parse(this.props.location.search).id) || 0;
        this.qid = parseInt(qs.parse(this.props.location.search).qid) || 0;
        this.saved = qs.parse(this.props.location.search).saved || false;

        this.getCustomerDetails();
        this.getCategoryList();
        // this.getProductList();
        // this.getCodeList();
    }

    async getCustomerDetails() {
        const customerResponse = await this.get_customer.get(this.id);
        this.setState({ get_customer_details: customerResponse.data });
    }

    async getCategoryList() {
        const categories = await this.categoryService.getAllCategories();
        this.setState({ allCategory: categories });
        this.setState({ categoryList: categories.filter((x) => x.parent_id === null) });
    }

    async getProductList() {
        return await this.productService.getAllProducts();
    }

    async getCodeList() {
        const codes = await this.CodesService.list();
        this.setState({ codeList: codes.data });
    }

    handleCategoryChange(categoryId, quoteLineItemsId) {
        const quoteData = { ...this.state.quoteFormData };
        const quoteLineItem = quoteData.quoteLineItems.find((x) => x.id === quoteLineItemsId);
        quoteLineItem.categoryId = categoryId;
        this.setState(quoteData);
        this.setState({ subCategoryList: this.state.allCategory.filter((c) => c.parent_id === categoryId) });
    }

    async handleSubCategoryChange(subCategoryId, quoteLineItemsId) {
        const quoteData = { ...this.state.quoteFormData };
        const quoteLineItem = quoteData.quoteLineItems.find((x) => x.id === quoteLineItemsId);
        quoteLineItem.subCategoryId = subCategoryId;
        this.setState(quoteData);

        this.setState({ loading: true });
        const products = await this.getProductList();
        this.setState({ loading: false });
        this.setState({ productList: products.filter((c) => c.category_id === subCategoryId) });
    }

    render() {
        const { get_customer_details, loading } = this.state;

        return (
            <>
                {/* Quote Header */}
                <div className="quote_head_row">
                    {loading ? `Pending...` : ""}
                    <span className="btn btn-light mr10 cursor_none">Name: {get_customer_details["name"]}</span>
                    <input
                        type="submit"
                        value="Create Quote"
                        className="px-4 btn btn-primary colorwhite submit_quote_btn mr10"
                    />
                </div>

                {/* Product Table */}

                <div>
                    <ProductTable
                        // onProductTableUpdate={this.handleProductTable.bind(this)}
                        // onRowAdd={this.handleAddEvent.bind(this)}
                        // onRowDel={this.handleRowDel.bind(this)}
                        // onRowClone={this.handleRowClone.bind(this)}
                        // products={this.state.line_item_options}
                        // accessories={this.state.get_accessories}
                        // components={this.state.select_components_option}
                        // codes={this.state.select_codes_option}
                        // filterText={this.state.filterText}
                        // hide_model={this.state.hide_model}

                        onCategoryChange={this.handleCategoryChange.bind(this)}
                        onSubCategoryChange={this.handleSubCategoryChange.bind(this)}
                        categories={this.state.categoryList}
                        subCategories={this.state.subCategoryList}
                        products={this.state.productList}
                        codes={this.state.codeList}
                        quoteFormData={this.state.quoteFormData}
                    />
                </div>
            </>
        );
    }
}
