
import React, { Component } from 'react';
import {
  Link,
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import {
	ListGroup, ListGroupItem,
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
	Card,CardHeader,CardBody,
	Alert, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';

import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import {add_line_item_post_data} from '../../../services/service_add_quote_line_item';
import {get_quote_line_item} from '../../../services/service_get_quote_line_item';

import CustomersService from '../../../services/CustomersService';
import AccessoriesService from '../../../services/AccessoriesService';
import DesignerService from '../../../services/DesignerService';
import ComponentService from '../../../services/ComponentService';
import CodesService from '../../../services/CodesService';

import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
const GLOBAL = require('../../../constant');


const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')
const qs = require('query-string');

class Addquotelineitem extends Component {

  constructor(props) {
    super(props);

    this.id = 0;
    this.qid = 0;
    this.saved = false;
    this.pdflink = '';
    this.discount = [];
    this.state = {
		get_accessories: [],
		get_designer: [],
		get_dealer_details :[],
		get_quote_line_item :[],
		showpdflink: false,
		status: false,
		get_customer_details:[],
		select_codes_option: [],
		select_components_option: [],
		cabinet_discount: 0,			
		accessories_discount: 0,			
		square_feet: 300,	  
    show_cabinetprice: 0,
		quoteforname: '',	  
		mode_cq : false,
		service_rows: [{}]		
    };
	this.get_customer = new CustomersService();

    this.state.filterText = "";
    this.state.designer_id = 0;
    this.state.removedlines = [];
    this.state.line_item_options = [
      {
        id: 1,
        code_id: '1',
        cabinet_carcass_id: '1',
        cabinet_shutter_id: '4',
        drawers_id: '31',
        hinges_id: '31',
        handles_id: '31',
        flap_up_id: '31',
        quote_id: '',
        cabinet_type_id: 'Base',
        quantity: 1,
        accessories: '{}'
      }
    ];
    this.add_quote_line_item = this.add_quote_line_item.bind(this);

	this.AccessoriesService = new AccessoriesService();
	this.DesignerService = new DesignerService();
	this.ComponentService = new ComponentService();
	this.CodesService = new CodesService();
	
    this.loadList = this.loadList.bind(this);
    this.loadDesigner = this.loadDesigner.bind(this);
	this.toggle_cq = this.toggle_cq.bind(this);
  }

  async componentDidMount() {
    await this.loadList();
    await this.loadDesigner();
  }
  async loadList(){
    let result = await this.AccessoriesService.list();
    if(result.success == true){
      this.setState({
        get_accessories: result.data
      });
    }	
  }
  
  async loadDesigner(){
    let result = await this.DesignerService.list();
    if(result.success == true){
      this.setState({
        get_designer: result.data
      });
    }	
  }
  
 
   async componentWillMount(){
    this.id = parseInt(qs.parse(this.props.location.search).id) || 0;
    this.qid = parseInt(qs.parse(this.props.location.search).qid) || 0;
    this.saved = qs.parse(this.props.location.search).saved || false;
	
    if(this.qid != 0){
		get_quote_line_item(this.qid).then((responseJson) => {
			let service_rows = responseJson.data.quote_lines.other_services;
			if(service_rows == undefined){
				service_rows = [{}];
			}
			this.setState({
				line_item_options: responseJson.data.quote_lines.cabinets,
				service_rows: service_rows,
				get_dealer_details: responseJson.data.dealer_details,
				});

		});
	}
	
	let results = await this.get_customer.get(this.id);
	this.setState({ get_customer_details: results.data });
	this.setState({ quoteforname: results.data.name });

    let components = await this.ComponentService.list();
    if(components.success == true){
      this.setState({
        select_components_option: components.data
      });
    }	

    let codes = await this.CodesService.list();
    if(codes.success == true){
      this.setState({
        select_codes_option: codes.data
      });
    }	
	
  }
 	
  add_quote_line_item(status) {
	  
	  let item_options = this.state.line_item_options;
	  let validate = item_options.filter(list => (list.cabinet_carcass_id == 31 && list.cabinet_shutter_id == 31));
	  let validate_quantity = item_options.filter(list => (list.quantity >= 21));
	  
	if((this.state.line_item_options).length > 0 && validate_quantity.length < 1){ 
		if(validate.length === 0){
			let revision = revision = this.qid;
			 if(this.saved == 'true'){
				 revision = 0;
			 }else{
				 revision = this.qid;
			 }
			let userdetails = JSON.parse(localStorage.getItem('userData'));		
				
				let post_json = {"products":this.state.line_item_options, "deleted":this.state.removedlines, "dealer_id":userdetails.id, "customer_id": this.id, "revision":revision, "status":status, "quote_id":this.qid, "designer_id":this.state.designer_id, "cabinet_discount":this.state.cabinet_discount, "accessories_discount":this.state.accessories_discount, "square_feet":this.state.square_feet, "show_cabinetprice":this.state.show_cabinetprice, "quoteforname":this.state.quoteforname, "other_services":this.state.service_rows };
				
				add_line_item_post_data('quote_line_item', post_json).then((responseJson) => {
				if(responseJson.success == true){
					if(responseJson.status == 1){
						this.pdflink = '/api/v2/download/pdf/'+responseJson.quote_id+'/?type=customer&token='+JSON.parse(localStorage.getItem('token'));
						this.setState({"status":responseJson.status});
						this.toggle_cq();
					}else{
						this.pdflink = '/addquotelineitem/?id='+this.id+'&qid='+responseJson.quote_id+'&saved=true';
						this.setState({"status":responseJson.status});
					}
				  
					this.setState({"showpdflink":true});
				}else{
				  alert("failed");
				}
				});
				
			
		}else{
			alert('Please select carcass or shutter..');
		}
	}else{
		alert('Please add minimun one cabinet / Please enter below 10 for cabinet quantity!');
	}
  }

  handleUserInput(filterText) {
    this.setState({filterText: filterText});
  };

  handleRowDel(product) {
    var index = this.state.line_item_options.indexOf(product);
    this.state.line_item_options.splice(index, 1);
    this.setState(this.state.line_item_options);
	
	this.state.removedlines.push(product.id);
	this.setState(this.state.removedlines);	
  };



  handleRowClone(pid, products) {

 		var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
		var product = {
		  id: id,
		  code_id: products.code_id,
		  cabinet_carcass_id: products.cabinet_carcass_id,
		  cabinet_shutter_id: products.cabinet_shutter_id,
		  drawers_id: products.drawers_id,
		  hinges_id: products.hinges_id,
		  handles_id: products.handles_id,
		  flap_up_id: products.flap_up_id,
		  quote_id: products.quote_id,
		  cabinet_type_id: products.cabinet_type_id,
		  quantity: products.quantity,
		  accessories: products.accessories,
		}
		this.state.hide_model = false;
		this.state.line_item_options.push(product);
		this.setState(this.state.line_item_options);
  };


  handleAddEvent(evt) {

    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var product = {
      id: id,
      code_id: '1',
      cabinet_carcass_id: '31',
      cabinet_shutter_id: '31',
      drawers_id: '31',
      hinges_id: '31',
      handles_id: '31',
      flap_up_id: '31',
      quote_id: '',
      cabinet_type_id: 'Base',
      quantity: 1,
      accessories: '{}'
    }
	this.state.hide_model = false;
    this.state.line_item_options.push(product);
    this.setState(this.state.line_item_options);

  }

	handleProductTable(evt) {
		var item = {
		  id: evt.target.id,
		  name: evt.target.name,
		  value: evt.target.value
		};
		
		if(item.name == 'accessories'){
			this.setState({hide_model:true});
		}

		var products = this.state.line_item_options.slice();
		var newProducts = products.map(function(product) {

		for (var key in product) {
		  if (key == item.name && product.id == item.id) {
			product[key] = item.value;

		  }
		}
		return product;
	});
		this.setState({products:newProducts});
	};
  
  
	quote_link_fun(text){
		return(		
				 <Link to={this.pdflink}  target={text} className="colorwhite">		
					 <button aria-pressed="true" className="btn btn-primary colorwhite px-4 mtb20">
					  {(this.state.status == 1) ?  <div>Download <i className="fa fa-file-pdf-o" aria-hidden="true"></i></div> :  'Continue'  } 
					 </button>
				 </Link>		
		)
	} 
	quote_alert_fun(text, c_name, c_id){	
		return(	<Alert color="success" className="alertmargin-70">Quote Succesfully {text} for {c_name} [{c_id}]</Alert>)
	}

	zeroPad(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	}

	toggle_cq() {
		this.setState({
		  modal_cq: !this.state.modal_cq,
		  hide_model: true
		});
	}
	
	ChangeDiscount(type, e) {
		if(type == 'square_feet' || type == 'quoteforname'){
			this.setState({[type]: e.target.value});			
		} else if (type == "show_cabinetprice") {
      this.setState({ [type]: e.target.checked });
    } else{
			this.setState({[type]: e.value});
		}			
		
	} 	
	
	discount_number_loop(number){
		const discount = [];
		for(var i=0;i<= number;i++){
			var arr = { value: i, label: i };
			discount.push(arr);
		}
		return discount;
	}

   /*Servicelist*/
  ServicehandleChange = idx => e => {
    const { name, value } = e.target;
    const service_rows = this.state.service_rows;
    service_rows[idx][name] = value;
    this.setState({
      service_rows
    });
	
  };
  ServicehandleAddRow = () => {
    const item = {
      other_service_name: "",
      other_service_price: ""
    };
    this.setState({
      service_rows: [...this.state.service_rows, item]
    });
  };
  ServicehandleRemoveSpecificRow = (idx) => () => {
    const service_rows = [...this.state.service_rows]
    service_rows.splice(idx, 1)    
	this.setState({ service_rows })
	
	this.state.removedlines.push(this.state.service_rows[idx].id);
	this.setState(this.state.removedlines);	
  }   
   /*Servicelist*/	
  
  render() {
	 
    const { get_customer_details } = this.state;
    const { status } = this.state;
	let quote_op_link = this.quote_link_fun('_blank');
	let quote_number = this.state.get_dealer_details.label+'-'+this.qid;
	let quote_alert_text = this.quote_alert_fun('Created!', get_customer_details['name'], get_customer_details['cid']);
	if(this.state.status == 2){
		quote_alert_text = this.quote_alert_fun('Saved!', get_customer_details['name'], get_customer_details['cid']);
		quote_op_link = this.quote_link_fun('_self');
	}
	
    if(this.id == 0){
      return (<Redirect to={'/customers'}/>)
    }
	
	const cabinet_discount_opt = this.discount_number_loop(GLOBAL.CAB_DISCOUNT);
	const accessories_discount_opt = this.discount_number_loop(GLOBAL.ACC_DISCOUNT);

	const designer_opt = [];
	this.state.get_designer.map(function(d, idx){
		var arr = { value: d.id, label: d.name };
		return designer_opt.push(arr);
	})

	const isEnabled = this.state.designer_id.length > 0 && this.state.square_feet.length > 0;	
	const submitEnabled = this.state.line_item_options.length > 0;	
    return (
      <div>
        <div className="quote_head_row">
		    <span className="btn btn-light mr10 cursor_none" style={this.qid !=0 && this.saved != 'true' ? { display: 'inline-block' } : {display: 'none' } }>Adding revision for Quote id: {quote_number}</span>
		      
			<span className="btn btn-light mr10 cursor_none" >Name: {get_customer_details['name']}</span>
			
			<button type="submit" disabled={!submitEnabled} id="save_quote" className="btn btn-outline-success mr10" onClick={this.add_quote_line_item.bind(this, 2)} style={this.state.showpdflink ? { display: 'none' } : {'background':'rgba(255, 255, 255, 0.8)'} }>Save</button>	

			<input type="submit" disabled={!submitEnabled} id="create_quote" value="Create Quote" className="px-4 btn btn-primary colorwhite submit_quote_btn mr10" onClick={this.toggle_cq}  style={this.state.showpdflink ? { display: 'none' } : {} }/>
			
			<Modal  isOpen={this.state.modal_cq} toggle={this.toggle_cq}>
			  <ModalHeader toggle={this.toggle_cq}>Create Quote </ModalHeader>
			  <ModalBody>

        <Form method="post" encType="multipart/form-data" className="form-horizontal">
		<FormGroup row>
			<Col md="6">
			  <Label htmlFor="text-input">Project Name <sup className="color_red">*</sup></Label>
			</Col>
			<Col md="6">
				<input type="text" id="quoteforname" defaultValue={get_customer_details['name']} className='form-control' onChange={this.ChangeDiscount.bind(this, 'quoteforname')} />
			</Col>
		</FormGroup>
		<FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Select Designer <sup className="color_red">*</sup></Label>
            </Col>
            <Col md="6">
				<Select
				isClearable
				name='designer_id' id='designer_id'  onChange={this.ChangeDiscount.bind(this, 'designer_id')} 
				options={designer_opt} />
            </Col>
          </FormGroup>
		  
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Cabinet Discount</Label>
            </Col>
            <Col md="6">
				<Select
				isClearable
				name='cabinet_discount' id='cabinet_discount' defaultValue={cabinet_discount_opt[0]} onChange={this.ChangeDiscount.bind(this, 'cabinet_discount')} 
				options={cabinet_discount_opt} />
            </Col>
          </FormGroup>
		  
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Accessories Discount</Label>
            </Col>
            <Col md="6">
				<Select
				isClearable
				name='accessories_discount' id='accessories_discount' defaultValue={accessories_discount_opt[0]} onChange={this.ChangeDiscount.bind(this, 'accessories_discount')}
				options={accessories_discount_opt} />
            </Col>
          </FormGroup>		  

          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Square Feet <sup className="color_red">*</sup></Label>
            </Col>
            <Col md="6">
              <Input type="number" id="square_feet" name="square_feet" placeholder="Ex: 300"  onChange={this.ChangeDiscount.bind(this, 'square_feet')} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="6">
              <Label htmlFor="text-input">Show individual cabinet pricing?</Label>
            </Col>
            <Col md="6">
              <Input type="checkbox" id="show_cabinetprice" name="show_cabinetprice"  onChange={this.ChangeDiscount.bind(this, 'show_cabinetprice')} />
            </Col>
          </FormGroup>
        </Form>			  
			  
			  </ModalBody>
				<ModalFooter>
					<span className="color_red" style={!isEnabled ? {} : { display: 'none' }}><sup>*</sup> Field required!</span>
					<Button disabled={!isEnabled} onClick={this.add_quote_line_item.bind(this, 1)} style={{'padding':'0'}}><span className="btn btn-primary">Create Quote</span></Button>
				</ModalFooter>
			</Modal>			
			
			  
		</div>

        <div style={this.state.showpdflink ? { display: 'none' } : {} }>
			<ProductTable onProductTableUpdate={this.handleProductTable.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} onRowClone={this.handleRowClone.bind(this)} products={this.state.line_item_options} accessories={this.state.get_accessories} components = {this.state.select_components_option} codes = {this.state.select_codes_option} filterText={this.state.filterText} hide_model={this.state.hide_model}/>	
				
			<div className="other_service fw">		
				<Col xs="12" md="6" className="offset-md-3">
					<Card>
						<CardHeader>
						<i className="fa fa-align-justify"></i><strong>Other Services</strong>
						</CardHeader>
						<CardBody>
        <div className="container">
          <div className="row clearfix">
		  <Button className="btn btn-success btn-md ml-2 service_add_btn" onClick={this.ServicehandleAddRow}>Add Services</Button>
            <div className="col-md-12 column">
              <Table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center"> Service Name </th>
                    <th className="text-center"> Service Price</th>
					<th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.service_rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx+1}</td>
                      <td>
                        <Input
                          type="text"
                          name="other_service_name"
                          value={this.state.service_rows[idx].other_service_name}
                          onChange={this.ServicehandleChange(idx)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          name="other_service_price"
                          value={this.state.service_rows[idx].other_service_price}
                          onChange={this.ServicehandleChange(idx)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <Button className="btn btn-ghost-danger btn-md" onClick={this.ServicehandleRemoveSpecificRow(idx)} >
                          <i className="fa fa-trash" aria-hidden="true"></i></Button>
						<Button className="btn btn-ghost-success btn-md ml-2" onClick={this.ServicehandleAddRow}><i className="fa fa-plus" aria-hidden="true"></i></Button>						
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
						</CardBody>
					</Card>					
				</Col>
			</div>
        </div>

		<div className="pdf_view text-center fw" style={this.state.showpdflink ? {} : { display: 'none' }}>
			<Col xs="12" md="6" className="offset-md-3">
			 {quote_alert_text}
			 {quote_op_link}
			</Col>
		</div>
		
	  </div>
    );

  }

}



class ProductTable extends React.Component {

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
    var product = this.props.products.map(function(product) {
     // if (product.code_id.indexOf(filterText) === -1) {
        //return;
     // }
      return (<ProductRow hide_model={hide_model} accessories={accessories} components={components} codes={codes} onProductTableUpdate={onProductTableUpdate} product={product} onDelEvent={rowDel.bind(this)} onCloneEvent={rowClone.bind(this)} key={product.id} sno={sno++}/>)
    });
    return (
      <div className="animated fadeIn">
             <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right px-4 wa">Add Cabinet</button>
             <Table hover className="table-outline mb-0 d-none d-sm-table bg_white quote_table">
              <thead className="thead-light">
                <tr>
                  <th width="5%">S.No</th>
                  <th width="8%">Type</th>
                  <th width="15%">Code</th>
                  <th width="10%">Carcass</th>
                  <th width="10%">Shutter</th>
                  <th width="9%">Hinges</th>
				  <th width="9%">Drawers</th>
                  <th width="9%">Handles</th>
                  <th width="9%">Flap Up</th>
                  <th width="7%">Qty</th>
				  <th width="12%" className="text-center" title="Accessories / Clone / Delete">A / C / D</th>
                </tr>
              </thead>
              <tbody>
                {product}
              </tbody>
            </Table>
      </div>
    );

  }

}

class ProductRow extends React.Component {
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
        <EditableCellType onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "cabinet_type_id",
          value: this.props.product.cabinet_type_id,
          id: this.props.product.id,
		  width:"8%"
        }}/>
        <EditableCellCode onProductTableUpdate={this.props.onProductTableUpdate} type={this.props.product.cabinet_type_id} codes={this.props.codes} cellData={{
          "type": "code_id",
          value: this.props.product.code_id,
          id: this.props.product.id,
		  width:"15%"
        }}/>
        <EditableCell components={this.props.components} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "cabinet_carcass_id",
          value: this.props.product.cabinet_carcass_id,
          id: this.props.product.id,
          c_type:"Carcass",
		  width:"10%"
        }}/>
        <EditableCell components={this.props.components} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "cabinet_shutter_id",
          value: this.props.product.cabinet_shutter_id,
          id: this.props.product.id,
          c_type:"Shutter",
		  width:"10%"
        }}/>
        <EditableCell components={this.props.components} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "hinges_id",
          value: this.props.product.hinges_id,
          id: this.props.product.id,
          c_type:"Hinges",
		  width:"9%"
        }}/>
        <EditableCell components={this.props.components} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "drawers_id",
          value: this.props.product.drawers_id,
          id: this.props.product.id,
          c_type:"Drawers",
		  width:"9%"
        }}/>		
        <EditableCell components={this.props.components} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "handles_id",
          value: this.props.product.handles_id,
          id: this.props.product.id,
          c_type:"Handles",
		  width:"9%"
        }}/>
        <EditableCell components={this.props.components} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "flap_up_id",
          value: this.props.product.flap_up_id,
          id: this.props.product.id,
          c_type:"Flap Up",
		  width:"9%"
        }}/>
        <EditableCellQuantity onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "quantity",
          value: this.props.product.quantity,
          id: this.props.product.id,
		  width:"7%"
        }}/>		
        <td className="clone-cell" width="12%">
			<EditableCellAcc hide_model={this.props.hide_model} onProductTableUpdate={this.props.onProductTableUpdate} sno={this.props.sno} accessories = {this.props.accessories} cellData={{
			  "type": "accessories",
			  value: this.props.product.accessories,
			  id: this.props.product.id,
			}}/>		
			<div onClick={this.onCloneEvent.bind(this)} value="Clone" className="btn btn-ghost-info colorwhite del-btn inline_block" ><i className="fa fa-clone" aria-hidden="true"></i></div>
			<div onClick={this.onDelEvent.bind(this)} value="Delete" className="btn btn-ghost-danger colorwhite del-btn inline_block" ><i className="fs16 fa fa-trash-o" aria-hidden="true"></i></div>		  
        </td>		
      </tr>
    );

  }

}

class EditableCellQuantity extends React.Component {
	checkLength(e){
		if(e.target.value > 20){
			document.getElementById('quantity_'+e.target.id).className += " alert_err";
		}else{
			document.getElementById('quantity_'+e.target.id).classList.remove("alert_err");
		}		
	}
    render() {
    return (
      <td id={'quantity_'+this.props.cellData.id} className="cabinet_quantity" width={this.props.cellData.width}>
	<span className="err">Max 20!</span>  
	<input min="1" max="20"  maxLength="2" style={{'height':'35px'}} className="form-control qty_input" type='number' name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate}  onInput={this.checkLength.bind(this)} />
      </td>
    );
  }

}

class EditableCellType extends React.Component {
    render() {
    return (
      <td width={this.props.cellData.width}>
        <select type="select" className="form-control wa" name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} >          
            <option value="Base">Base</option>
            <option value="Wall">Wall</option>
            <option value="Tall">Tall</option>
            <option value="Others">Others</option>
        </select>
      </td>
    );
  }

}
class EditableCellCode extends React.Component {

  constructor(props) {
		super(props);
		this.state = {
		  selectedOption: this.props.cellData.value,
		  getOption:[],
		  getCodes:[],
		}
	}


    handleChange = (selectedOption) => {
      if(selectedOption != null){
        this.setState({ selectedOption });
        var array = {
          id: this.props.cellData.id,
          name: this.props.cellData.type,
          value: selectedOption.value
        }
        var arr = {target:array}
        this.props.onProductTableUpdate(arr);
      }else{
        this.setState({selectedOption : 'Sealect..' });
      }

    }

    componentWillReceiveProps(nextProps){
      this.setState({ getCodes:  this.props.codes});  
    }

    render() {

      let filter_code = this.props.codes.filter(type =>{
			if(this.props.type == 'Others'){
				return type.cabinet_type != 'Base' && type.cabinet_type != 'Wall' && type.cabinet_type != 'Tall';
				
			}else{
				return type.cabinet_type == this.props.type;
			}
			
	  });	
	  
      let codes = [];
      filter_code.forEach(function(res, key) {
        var array = {
          value: res.id,
          label: res.code+'-'+res.description
        }
        codes[res.id] = array;
      });
     	  
     let defaultValue = '';	 
     if(codes.length > 0 && codes != undefined && codes !=null){  
		if(codes[this.props.cellData.value] != undefined){
			defaultValue = codes[this.props.cellData.value];
		}	
     }

    return (
      <td className="select-up" width={this.props.cellData.width}>
      <Select
      backspaceRemoves  isClearable
      className="menu-outer-top"
       name={this.props.cellData.type} id={this.props.cellData.id} value={defaultValue} onChange={this.handleChange}
      options={codes}
      />
      </td>
    );
  }

}
class EditableCellAcc extends React.Component {
     
	constructor(props) {
		super(props);
		this.state = {
		  modal: false,
		  selected :{},
		  resetAcc :[],
		  selectedAcc :{},
		  hide_model:false,
		  addClass: false
		}
		this.tpacc = {};
		this.accfilter = this.accfilter.bind(this);
		this.toggle = this.toggle.bind(this);
		this.qtyChange = this.qtyChange.bind(this);
		
	}
	
	toggle() {
		if(this.props.cellData.value !=''){
		
			if(typeof this.props.cellData.value === 'string'){
				this.setState({ 'selectedAcc':JSON.parse(this.props.cellData.value) });
				this.tpacc = JSON.parse(this.props.cellData.value);
			}else{
				if(this.props.cellData.value === null){
					this.setState({ 'selectedAcc': {} });
					this.tpacc = {};						
				}else{
					this.setState({ 'selectedAcc':this.props.cellData.value });
					this.tpacc = this.props.cellData.value;						
				}
			}	
			
		}
		this.setState({
			modal: !this.state.modal,
			hide_model: true
		});
	}

	
	 componentWillReceiveProps(nextProps){
		 
		this.setState({ hide_model: nextProps.val > this.props.hide_model });
		if(this.state.hide_model == true){
		  this.setState({
			  modal: false
			});
		}		
	 }

	 
	qtyChange(e) {
        var eid = e.target.id;
        var evalue = e.target.value;
		
 		if(e.target.value !=''){
			if(evalue >= 6 || evalue <= 0){
				document.getElementById('list_'+eid).className += " alert_err";
				document.getElementsByClassName("acc_update_btn")[0].setAttribute("disabled", "");
				
			}else{
				document.getElementsByClassName("acc_update_btn")[0].removeAttribute("disabled", "");
				document.getElementById('list_'+eid).classList.remove("alert_err");
				this.state.selectedAcc[eid] = evalue;
				this.setState({'selectedAcc':this.state.selectedAcc});
				
			}
		}else{ 
			document.getElementById('list_'+eid).classList.remove("alert_err");
			const acc = this.state.selectedAcc;
			const newAcc = Object.keys(acc).reduce((object, key) => {
			  if (key !== eid) {
				object[key] = acc[key]
			  }
			  return object
			}, {});		
		    this.setState({'selectedAcc':newAcc});
		}
		
	
	}
	  
	accfilter(accid){  	    
		  if(this.state.selectedAcc != '' && this.state.selectedAcc != null){ 
		  if((this.state.selectedAcc)[accid] != undefined){
				return (this.state.selectedAcc)[accid];
			}
		  }   
	} 

  
	render() {
	const selectedAcc = JSON.stringify(this.state.selectedAcc);
    return (
		<div style={{'display':'inline-block'}}>
        <div className="btn btn-ghost-success" onClick={this.toggle} value={this.state.selected}><i className="fa fa-plus" aria-hidden="true"></i></div>
		<Modal  isOpen={this.state.modal} toggle={this.toggle} backdrop="static" keyboard={false} className={'acc_model modal-lg '}>
		  <ModalHeader>
			S.No-<span>{this.props.sno}</span> for Select Accessories 
			<div className="top_update_btn">	
			<Button color="primary" name={this.props.cellData.type} id={this.props.cellData.id} value={selectedAcc} 
		  onClick={this.props.onProductTableUpdate} className="acc_update_btn btn btn-success mr10">Update</Button>
			
		    </div>
		  </ModalHeader>
		  <ModalBody>
		  
		  <ListGroup>
			  <CheckboxGroup name="acc" >
				  {this.props.accessories.map(option =>
					<ListGroupItem key={option.id} id={'list_'+option.id} title={option.code+' - '+option.name}>
						<span className="err">Acceptable value only 1 to 5!</span>
						<Input id={option.id} onChange={this.qtyChange} defaultValue={this.accfilter(option.id)}  type="number" min="1" max="5" className="mr10 acc_input" /> {option.code} - {(option.name).substr(0, 35)}{(option.name.length  > 35) ?   ' ...':  ''  }
						
					</ListGroupItem>
				  )}
			  </CheckboxGroup>
		 </ListGroup>

		  </ModalBody>
		  
			<ModalFooter>
			  <Alert className="m0" color="success" style={this.state.hide_model ? {display: 'none'} : {display: 'block'}}>
				Accessories Saved!
			  </Alert>
			  <Button className="acc_update_btn" color="primary" type="text" name={this.props.cellData.type} id={this.props.cellData.id} value={selectedAcc} onClick={this.props.onProductTableUpdate} >Update</Button>
			</ModalFooter>
		</Modal>
      </div>
    );
  }

}
class EditableCell extends React.Component {

    render() {
    const options = this.props.components.filter(type => type.component_type == this.props.cellData.c_type);
    return (
      <td width={this.props.cellData.width}>
        <select type='select' type="select" className="form-control wa" name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate}>
		  <option value="31">NA</option>
          {options.map(option =>
            <option key={option.id+option.component_name} value={option.id}>{option.component_name}</option>
          )}
        </select>
      </td>
    );
  }

}

export default Addquotelineitem;
