import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import _ from "lodash";

import QuotesService from '../../../services/QuotesService';
import CustomersService from '../../../services/CustomersService';
import { UploadSignupFiles } from '../../../services/UploadSignupFiles';

import {
    Badge,
    Button,
    Card,
    Col,
    Row,
    Form,
    Label,
    FormGroup,
    Table, Modal, ModalHeader, ModalBody, ModalFooter, Alert, TabContent, TabPane, NavItem, Nav, NavLink
} from 'reactstrap';

import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';

import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
const GLOBAL = require('../../../constant');

const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')
const time = new Date();
const current_time = time.getHours() + "" + time.getMinutes() + "" + time.getSeconds();

class Dealerquote extends Component {
    constructor(props) {
        super(props);
        this.alert_msg = '';
        this.imgUpload = [];
        this.alert_upload_msg = '-';
        this.state = {
            data: [],
            pages: null,
            loading: true,
            list: [],
            allData: [],
            user: JSON.parse(localStorage.getItem('userData')),
            modal_d: false,
            modal_clone: false,
            hide_model: false,
            show_msg: false,
            activeTab: new Array(4).fill('1'),
            selected_quote_row: [],
            admin_discount: {},
            selected_quote_id: 0,
            selected_customer_id: 0,
            download: {},
            discounfortuserArray: { "D": 'dealer', "B": 'builder', "O": 'oem', "H": 'home' },
            admin_square_feet: 0,
            get_customers: [],
            alert_msg_clone: '',
            show_msg_text: '',
            show_img_file: '',
            selected_quote: [],
            uploadloader: false,
            valid_days: 30, // Add this property and set the default value
        };
        this.QuotesService = new QuotesService();
        this.get_customer = new CustomersService();
        this.toggle_close = this.toggle_close.bind(this);
        this.toggle_close_clone = this.toggle_close_clone.bind(this);
        this.upload_toggle_close = this.upload_toggle_close.bind(this);

    }

    getBase64(e) {
        e.preventDefault();
        this.setState({ uploadloader: true });
        let quote_details = this.state.selected_quote_row_upload;
        let customer_id = this.state.selected_quote_row_customer_id;
        let dealer_id = this.state.selected_quote_row_dealer_id;
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            let list = [{
                pdfdata: reader['result'], quote: quote_details,
                customer: customer_id, dealer: dealer_id
            }];
            this.imgUpload = list;

            UploadSignupFiles(this.imgUpload).then((responseJson) => {
                if (responseJson.success == true) {
                    this.render_tabler_row_upload(responseJson);
                }
                this.setState({
                    show_upd_msg: true,
                    show_msg_text: responseJson.msg,
                    uploadloader: false
                });
            });
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    }

    render_tabler_row_upload(d) {
        let render_files = '';
        if (d.uploadfiles != '') {
            render_files = d.uploadfiles.map((imgval) =>
                <tr key={imgval.toString()}>
                    <td className="text-left">{imgval.substring(imgval.lastIndexOf('/') + 1)}</td>
                    <td><a href={'/api/v2/' + imgval} target="_blank" className="fw text-center" download><i className="fa fa-download"></i></a></td>
                </tr>
            );
        }
        this.setState({
            show_img_file: render_files
        });
    }
    upload_toggle_d(d) {
        this.render_tabler_row_upload(d);
        this.setState({
            selected_quote: d,
            selected_quote_row_upload: d.quote_id,
            selected_quote_row_customer_id: d.customer_id,
            selected_quote_row_dealer_id: d.dealer_id,
            uploadr_modal_d: true,
            show_upd_msg: true
        });
    }
    responseMsg(msg) {
        this.setState({
            show_msg_text: msg
        });
    }

    upload_toggle_close() {
        this.setState({
            uploadr_modal_d: !this.state.uploadr_modal_d,
            upd_hide_model: true,
            show_upd_msg: false,
            show_msg_text: ''
        });

    }

    table_row_model_upload() {
        return (<div>
            <Modal isOpen={this.state.uploadr_modal_d} toggle={this.upload_toggle_close} backdrop="static" keyboard={false} className="download_quote">
                <ModalHeader>Customer Sign Copy - <i className="fa fa-upload"></i> - {this.state.selected_quote.quote_number}
                    <Button className="close close_pos" title="Close" onClick={this.upload_toggle_close.bind(this)} ><span aria-hidden="true">×</span></Button>
                </ModalHeader>
                <ModalBody>
                    <div className="text-center">

                        <div className="uploadrow">
                            <span className="btn btn-outline-success" >
                                <input
                                    id="imgUpload"
                                    type="file"
                                    name="input-file"
                                    className="hide_upload_file"
                                    onChange={this.getBase64.bind(this)}
                                />
                                <label htmlFor="imgUpload" className="mb-0" style={{ padding: '5px 20px' }}>Upload <i className="fa fa-upload btn"></i></label>
                            </span>
                            <div className="activeloader" style={this.state.uploadloader ? {} : { display: 'none' }}>
                                <i className="fa fa-circle-o-notch fa-spin load"></i>
                            </div>
                        </div>
                        <div className="alertmargin-20" style={this.state.show_upd_msg ? {} : { display: 'none' }}>
                            <div className="col-md-12 cover-img-quotes">
                                <Table className='admindownload' responsive>
                                    <thead><tr><th className="text-left">File Name</th><th>Download</th></tr></thead>
                                    <tbody>{this.state.show_img_file}</tbody>
                                </Table>
                            </div>
                            <Alert color="success cus-quotes-img" style={this.state.show_msg_text == '' ? { display: 'none' } : {}}>
                                <span>{this.state.show_msg_text}</span>
                            </Alert>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>);
    }


    ChangeDiscount(type, e) {

        if (type != 'admin_square_feet') {
            const newArray = this.state.admin_discount;
            newArray[type] = e.value
            this.setState({
                admin_discount: newArray,
            });

        } else {
            this.setState({
                admin_square_feet: e.target.value,
            });
        }

        if ('selected_customer_id' === type) {
            this.setState({
                selected_customer_id: e.value
            });
        }

    }

    discount_number_loop(number) {
        const discount = [];
        for (var i = 0; i <= number; i++) {
            var arr = { value: i, label: i };
            discount.push(arr);
        }
        return discount;
    }
    admin_discount_number_loop(number) {
        const discount = [];
        number.map(function (percentage, i) {
            var arr = { value: percentage, label: percentage };
            discount.push(arr);
        })
        return discount;
    }

    QuoteClone(e) {
        this.QuotesService.quote_clone(
            this.state.selected_quote_row.quote_id, this.state.selected_customer_id
        ).then(res => {
            if (res.success == false) {
                this.err = res.err;
            }
            this.setState({ alert_msg_clone: this.response_msg_clone(res, res.data, this.state.selected_customer_id) });

        })
            .catch(err => {
                (err.message).then(data => {
                    alert("Issue occurred." + data);
                });
            });
        return false;
    }

    response_msg_clone(res, quote_id, customer_id) {
        let classname = 'btn btn-outline-danger';
        if (res.success === true) {
            classname = 'btn btn-outline-success';
        }
        return (<div className="fw"><Col md="12" className="text-center mt-4">
            <span className={classname}>{res.msg}</span>
        </Col>
            <Col md="12" className="text-center mt-3">
                <Link to={"/addquotelineitem/?id=" + customer_id + "&qid=" + quote_id + "&saved=true"} className="btn btn-ghost-info fs16 colorwhite" title="Edit">Go To Edit</Link>
            </Col></div>
        );
    }

    at_home_discount_value(typekey) {
        if (typekey == 'H') {
            const newArray = this.state.admin_discount;
            newArray['H'] = GLOBAL.ATHOME_DISCOUNT;
            this.setState({
                admin_discount: newArray,
                admin_square_feet: 0
            });
        }
    }

    genDiscountReport(e, status) {

        var adminDis = {};
        this.at_home_discount_value(e);
        adminDis[e] = (this.state.admin_discount)[e];
        let discount = JSON.stringify(adminDis);
        console.log(this.state.admin_discount);
        if ((Object.keys(this.state.admin_discount).length) == 0) { alert('Please select discount!'); return; }
        this.QuotesService.add(
            this.state.selected_quote_id,
            discount,
            this.state.admin_square_feet,
            status
        )
            .then(res => {
                if (res.success == false) {
                    this.err = res.err;
                } else {
                    this.props.history.replace('/quotelist');
                }
                this.alert_msg = res.msg;
                this.setState({ "show_msg": true });
                this.componentWillMount();
                const downloads = this.state.download;
                downloads[res.data.discounfortuser] = this.admin_download_link(res.data, 'directcall');
                this.setState({
                    download: downloads,
                });


            })
            .catch(err => {
                (err.message).then(data => {
                    alert("Issue occurred." + data);
                });
            });
        return false;
    }

    toggle_d(d) {
        this.setState({
            selected_quote_row: d,
            modal_d: !this.state.modal_d,
            hide_model: true
        });
        this.setState({ "show_msg": false });
    }
    toggle_clone(d) {
        this.setState({
            selected_quote_row: d,
            modal_clone: !this.state.modal_clone,
            hide_model: true
        });
        this.setState({ "show_msg": false });
    }
    toggle_close() {
        this.setState({
            modal_d: !this.state.modal_d,
            hide_model: true
        });
    }

    toggle_close_clone() {
        this.setState({
            modal_clone: !this.state.modal_clone,
            hide_model: true
        });
    }

    toggle_tab(tabPane, tab, quote_id) {
        const newArray = this.state.activeTab.slice()
        newArray[tabPane] = tab
        this.setState({
            activeTab: newArray,
        });
        this.setState({ selected_quote_id: quote_id });
    }
    async componentWillMount() {
        let userdetails = JSON.parse(localStorage.getItem('userData'));
        let result = await this.QuotesService.list(userdetails.id, userdetails.user_type);
        if (result.success == true) {
            this.setState({
                allData: result.data
            });

            this.setState({
                list: result.data.filter(ret => parseInt(ret.status) !== 3)
            });

        }

        let filter_list = (await this.get_customer.list()).data.filter(type => type.dealer_id === this.state.user.id);
        this.setState({
            get_customers: filter_list
        });
    }

    requestData(pageSize, page, sorted, filtered) {
        return new Promise((resolve, reject) => {
            let filteredData = this.state.list;

            if (filtered.length) {
                filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                    return filteredSoFar.filter(row => {
                        return (row[nextFilter.id] + "").includes(nextFilter.value);
                    });
                }, filteredData);
            }
            const sortedData = _.orderBy(
                filteredData,
                sorted.map(sort => {
                    return row => {
                        if (row[sort.id] === null || row[sort.id] === undefined) {
                            return -Infinity;
                        }
                        return typeof row[sort.id] === "string"
                            ? row[sort.id].toLowerCase()
                            : row[sort.id];
                    };
                }),
                sorted.map(d => (d.desc ? "desc" : "asc"))
            );

            const res = {
                rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
                pages: Math.ceil(filteredData.length / pageSize)
            };

            setTimeout(() => resolve(res), 300);
        });
    }

    state_instance(state, instance) {
        this.requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
            this.setState({
                data: res.rows,
                pages: res.pages,
                loading: false
            });

        })
    }

    fetchData(state, instance) {
        this.setState({ loading: true });
        if (state != undefined && this.state.list == '') {
            setTimeout(() => this.state_instance(state, instance), 3000);
        } else {
            if (state != undefined) {

                this.state_instance(state, instance)
            }
        }
    }

    clone_quote_model() {
        const customer_opt = [];
        this.state.get_customers.map(function (d, idx) {
            var arr = { value: d.id, label: d.name };
            return customer_opt.push(arr);
        })
        return (
            <Modal isOpen={this.state.modal_clone} toggle={this.toggle_close_clone} backdrop="static" keyboard={false}>
                <ModalHeader toggle={this.toggle_close_clone}>Quote for customer</ModalHeader>
                <ModalBody>

                    <Form method="post" encType="multipart/form-data" className="form-horizontal">

                        <FormGroup row>
                            <Col md="6">
                                <Label htmlFor="text-input" className="clonequotecl">Select Customer <sup className="color_red">*</sup></Label>
                            </Col>
                            <Col md="6">
                                <Select
                                    isClearable
                                    name='selected_customer_id' id='selected_customer_id' onChange={this.ChangeDiscount.bind(this, 'selected_customer_id')}
                                    options={customer_opt} />
                            </Col>
                            {this.state.alert_msg_clone}
                        </FormGroup>

                    </Form>


                </ModalBody>
                <ModalFooter style={this.state.alert_msg_clone != '' ? { display: 'none' } : {}}>
                    <Button onClick={this.QuoteClone.bind(this)} style={{ 'padding': 0 }}><span className="btn btn-primary">Submit</span></Button>
                </ModalFooter>
            </Modal>
        );
    }

    admin_download_link(res, call) {
        const type = (this.state.discounfortuserArray)[res.discounfortuser];
        let pdf_url = "/api/v2/download/pdf/" + res.quote_id + "?type=" + type + "&discount=" + res.discount + "&token=" + JSON.parse(localStorage.getItem('token')) + '&' + current_time;
        let excel_url = "/api/v2/download/excel/" + res.quote_id + "?type=" + type + "&discount=" + res.discount + "&token=" + JSON.parse(localStorage.getItem('token')) + '&' + current_time;

        if (res.admin_download_excel != '' && call == '') {
            excel_url = "/api/v2/" + res.admin_download_excel + "?token=" + JSON.parse(localStorage.getItem('token')) + '&' + current_time;
        }
        if (res.admin_download_pdf != '' && call == '') {
            pdf_url = "/api/v2/" + res.admin_download_pdf + "?token=" + JSON.parse(localStorage.getItem('token')) + '&' + current_time;
        }

        return (<div className="downloadlink_btn">
            <Link to={pdf_url} title="Download PDF" target="_blank" className={'btn btn-ghost-primary'} download>
                <i className="fa fa-file-pdf-o fs16"></i></Link>
            <Link to={excel_url} target="_blank" title="Download Excel" className="btn btn-ghost-success" download>
                <i className="fa fa-file-excel-o fs16"></i>
            </Link>
        </div>);
    }

    download_link(d, type) {
        let pdf_url = "/api/v2/download/pdf/" + d.quote_id + "?type=" + type + "&token=" + JSON.parse(localStorage.getItem('token')) + "&" + current_time;
        if (type == 'customer') {
            pdf_url = "/api/v2/" + d.customer_path + "?&token=" + JSON.parse(localStorage.getItem('token')) + '&' + current_time;
        }
        return (<div>
            {(d.status != 2) ?
                <Link to={pdf_url} title="Download PDF" target="_blank" className={'btn btn-ghost-primary'} download>
                    <i className="fa fa-file-pdf-o fs16"></i></Link>
                : <div>-</div>}
            {(this.state.user.user_type == "SA") ?
                <Link to={"/api/v2/download/excel/" + d.quote_id + "?type=" + type + "&token=" + JSON.parse(localStorage.getItem('token')) + "&" + current_time} target="_blank" title="Download Excel" className="btn btn-ghost-success" download>
                    <i className="fa fa-file-excel-o fs16"></i>
                </Link>
                : ""}
        </div>);
    }

    returnTableData(quote_id, type) {

        let filter_quote = [];
        filter_quote = this.state.allData.filter(ret => (parseInt(ret.admin_revision) == quote_id) && (ret.discounfortuser == type));
        return (<div>
            <p>Available Quotes:-</p>
            <Table className='admindownload' responsive>
                <thead>
                    <tr>
                        <th>Quote Id / Customer Name</th>
                        <th className="text-center">Discount %</th>
                        <th className="text-center">Download</th>
                    </tr>
                </thead>
                <tbody>

                    {filter_quote.map(option =>
                        <tr key={option.quote_id} >
                            <td>{option.quote_number}-{((this.state.discounfortuserArray)[type]).toUpperCase()} / {option.name}</td>
                            <td className="text-center">{option.discount} %</td>
                            <td className="text-center">{this.admin_download_link(option, '')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>);
    }

    render_newquote_genform(type, typekey, status) {
        const admin_discount_opt = this.admin_discount_number_loop(GLOBAL.ADMIN_DISCOUNT);
        let default_select = 0;
        let default_input = 0;
        let disbaled = false;
        if (typekey == 'H') {
            default_select = GLOBAL.ATHOME_DISCOUNT;
            disbaled = true
            default_input = 0;
        }
        return (
            <Row>
                <Col xs="4">
                    <FormGroup>
                        <Label>Add Discount</Label>
                        <Select
                            name={type}
                            id={type}
                            className='select'
                            defaultValue={{ label: default_select, value: default_select }}
                            onChange={this.ChangeDiscount.bind(this, typekey)}
                            options={admin_discount_opt}
                            isDisabled={disbaled ? true : null}
                        />
                    </FormGroup>
                </Col>
                <Col xs="4">
                    <FormGroup>
                        <Label>Installation Square Feet</Label>
                        <input type="number" id="admin_square_feet" defaultValue={default_input} className='form-control' onChange={this.ChangeDiscount.bind(this, 'admin_square_feet')} disabled={disbaled ? 'disabled' : null} />
                    </FormGroup>
                </Col>
                <Col xs="4">
                    <FormGroup className="discount_sub">
                        <Button type="button" size="sm" color="primary" onClick={this.genDiscountReport.bind(this, typekey, status)}>Generate Quote</Button>
                    </FormGroup>
                </Col>
            </Row>
        );
    }

    table_row_model() {
        const d = this.state.selected_quote_row;

        return (<div>
            <Modal isOpen={this.state.modal_d} toggle={this.toggle_close} backdrop="static" keyboard={false} className="modal-lg download_quote">
                <ModalHeader>Download Quote - {d.quote_number} <i className="fa fa-download"></i> <Button className="close close_pos" title="Close" onClick={this.toggle_close.bind(this)} ><span aria-hidden="true">×</span></Button></ModalHeader>
                <ModalBody>
                    <div style={this.state.show_msg ? {} : { display: 'none' }}>
                        <Alert color="success" >
                            {this.alert_msg}
                        </Alert>
                    </div>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                active={this.state.activeTab[0] === '1'}
                                onClick={() => { this.toggle_tab(0, '1', d.quote_id); }}
                            >
                                Customer
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={this.state.activeTab[0] === '2'}
                                onClick={() => { this.toggle_tab(0, '2', d.quote_id); }}
                            >
                                Dealer
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={this.state.activeTab[0] === '3'}
                                onClick={() => { this.toggle_tab(0, '3', d.quote_id); }}
                            >
                                Builder
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={this.state.activeTab[0] === '4'}
                                onClick={() => { this.toggle_tab(0, '4', d.quote_id); }}
                            >
                                OEM
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={this.state.activeTab[0] === '5'}
                                onClick={() => { this.toggle_tab(0, '5', d.quote_id); }}
                            >
                                @HOME
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab[0]} className="listing">
                        <TabPane tabId="1" className="customer_tab">
                            {this.download_link(d, 'customer')}
                        </TabPane>
                        <TabPane tabId="2">
                            {this.returnTableData(d.quote_id, 'D')}
                            <div className="quote_gen_col">
                                {this.render_newquote_genform('dealer_discount', 'D', d.status)}
                            </div>

                        </TabPane>

                        <TabPane tabId="3">
                            {this.returnTableData(d.quote_id, 'B')}
                            <div className="quote_gen_col">
                                {this.render_newquote_genform('builder_discount', 'B', d.status)}
                            </div>

                        </TabPane>

                        <TabPane tabId="4">
                            {this.returnTableData(d.quote_id, 'O')}
                            <div className="quote_gen_col">
                                {this.render_newquote_genform('oem_discount', 'O', d.status)}
                            </div>

                        </TabPane>
                        <TabPane tabId="5">
                            {this.returnTableData(d.quote_id, 'H')}
                            <div className="quote_gen_col">
                                {this.render_newquote_genform('home_discount', 'H', d.status)}
                            </div>

                        </TabPane>

                    </TabContent>

                </ModalBody>
            </Modal>
        </div>);
    }

    // This is my function written
    updateValidDays = (row, days) => {
        const quote_id = row._original.quote_id;
        const valid_days = days;
        // You can use fetch or any other API library here
        fetch(`${GLOBAL.BASE_URL}api/v2/quotes/updateQuoteValidity`, {
            method: "POST",
            body: JSON.stringify({ quote_id: parseInt(quote_id), valid_days: parseInt(valid_days) }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the API response as needed
                if (data.success) {
                    // Update the state or show a success message
                } else {
                    // Handle errors
                }
            })
            .catch((error) => {
                console.error("Error updating valid days:", error);
            });
    };


    render() {

        const { data, pages, loading } = this.state;
        return (
            <div className="react_table animated fadeIn no_flex_table">
                <Row>
                    <Col>
                        <Card>
                            <ReactTable
                                columns={[
                                    {
                                        Header: "Quote Id",
                                        id: "quote_number",
                                        maxWidth: 150,
                                        accessor: d => d.quote_number,
                                        className: "text-center"
                                    },
                                    {
                                        Header: "Date created",
                                        id: "date_created",
                                        maxWidth: 120,
                                        accessor: d => (<span title={d.date_created}>{d.date_created}</span>),
                                        filterable: false
                                    },
                                    {
                                        Header: "Valid Days",
                                        accessor: "valid_days",
                                        maxWidth: 100,
                                        className: "text-center",
                                        filterable: false,
                                        // You can access it using d.valid_days
                                        Cell: ({ row }) => (
                                            <div>
                                                {row._original.valid_days}
                                                <input
                                                    type="number"
                                                    // value={row._original.valid_days}
                                                    onChange={(e) => this.updateValidDays(row, e.target.value)}
                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        Header: "Dealer Name",
                                        id: "user_name",
                                        maxWidth: 200,
                                        show: (this.state.user.user_type != "SA" ? false : true),
                                        accessor: d => d.user_name
                                    },
                                    {
                                        Header: "Customer Details",
                                        id: "name",
                                        accessor: d => (<span><i className="fa fa-user-o" aria-hidden="true"></i> {d.name}, <i className="fa fa-envelope" aria-hidden="true"></i> {d.email}, <i className="fa fa-phone" aria-hidden="true"></i> {d.phone}</span>),
                                        filterable: false
                                    },
                                    {
                                        Header: "Project",
                                        id: "project",
                                        maxWidth: 150,
                                        accessor: d => d.quoteforname
                                    },
                                    {
                                        Header: "Revision for",
                                        id: "revision",
                                        filterable: false,
                                        show: (this.state.user.user_type == "SA" ? false : true),
                                        maxWidth: 120,
                                        accessor: d => (<span>
                                            {(d.revision != 0 && this.state.user.user_type != "SA") ?
                                                <span>{d.quote_revision}</span> : ''}

                                            {(d.admin_revision != 0 && this.state.user.user_type == "SA") ? <div>{d.admin_revision}</div> : ''}
                                        </span>)
                                    },
                                    {
                                        Header: "Sign Copy",
                                        id: "uploadfilescount",
                                        className: "text-center",
                                        maxWidth: 100,
                                        show: (this.state.user.user_type != "SA" ? false : true),
                                        accessor: d => (<span className="list" onClick={this.upload_toggle_d.bind(this, d)} title="File upload"><span id="customer_sign_copy" style={d.uploadfilescount !== 'yes' ? { background: '#dd0606' } : { background: 'green' }}>{d.uploadfilescount}</span></span>),

                                        filterMethod: (filter, d) => {
                                            if (filter.value === "") {
                                                return true;
                                            }
                                            if (filter.value === "no") {
                                                return d[filter.id] === 'no';
                                            }
                                            if (filter.value === "yes") {
                                                return d[filter.id] === 'yes';
                                            }
                                        },
                                        Filter: ({ filter, onChange }) =>
                                            <select
                                                onChange={event => onChange(event.target.value)}
                                                style={{ width: "100%", display: "none" }}
                                                value={filter ? filter.value : "all"}
                                            >
                                                <option value="">Show All</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>

                                    },
                                    {
                                        Header: "Action",
                                        id: "action",
                                        maxWidth: 200,
                                        className: "text-center",
                                        filterable: false,
                                        accessor: d => (
                                            <div className="listrow">
                                                <span className="list" style={this.state.user.user_type == "SA" ? { display: 'none' } : {}}>
                                                    {(d.status != 2) ?
                                                        <Link to={"/addquotelineitem/?id=" + d.customer_id + "&qid=" + d.quote_id} className="btn btn-ghost-info fs16" title="Revision"> R </Link> : <Link to={"/addquotelineitem/?id=" + d.customer_id + "&qid=" + d.quote_id + "&saved=true"} className="btn btn-ghost-info fs16" title="Continue">
                                                            <i className="fa fa-long-arrow-right fs16"></i></Link>
                                                    }
                                                </span>
                                                <span className="list" style={this.state.user.user_type == "SA" ? { display: 'none' } : {}}>
                                                    {(d.status == 1) ?
                                                        <div onClick={this.toggle_clone.bind(this, d)} className="btn btn-ghost-dark colorwhite del-btn inline_block" title="Quote Clone"><i className="fa fa-clone" aria-hidden="true"></i></div> : '-'}
                                                </span>
                                                <span className="list">
                                                    {(this.state.user.user_type == "SA") ? <span onClick={this.toggle_d.bind(this, d)} className="btn btn-ghost-primary"><i className="fa fa-download" aria-hidden="true"></i></span> :
                                                        (d.status != 2 && this.state.user.user_type != "SA") ?
                                                            <Link to={"/api/v2/" + d.customer_path + "?" + current_time} target="_blank" title="Download PDF" className={d.file_exist != true ? 'btn btn-ghost-danger not-active' : 'btn btn-ghost-danger'} download >
                                                                <i className={d.file_exist != true ? 'fa fs-16 fa-exclamation-triangle' : 'fa fs-16 fa-file-pdf-o'} ></i></Link>
                                                            : <div>-</div>
                                                    }
                                                </span>
                                            </div>
                                        )
                                    }

                                ]}
                                manual
                                data={data}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.fetchData.bind(this)}
                                filterable
                                defaultPageSize={10}
                                noDataText=''
                                className="-striped -highlight"
                                loadingText='Loading...'
                                style={{
                                    height: "650px"
                                }}

                            />
                            {this.table_row_model()}
                            {this.clone_quote_model()}
                            {this.table_row_model_upload()}
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dealerquote;
