import React, { Component } from 'react';
import { NavLink, Button, Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, TabContent, TabPane, NavItem, Nav, Alert, Table} from 'reactstrap';
import WarrantyOrderFormService from '../../services/WarrantyOrderFormService';
import Select from 'react-select';

const GLOBAL = require('../../constant');
const qs = require('query-string');

class AddUpdate extends Component {
  constructor(props) {
    super(props);
    this.alert_msg = '-';
    this.err = '';
    this.input_disabled = false;
    this.state = {
      customer_name:'',
      customer_address:'',
      customer_city:'',
      customer_postalcode:'',
      customer_email:'',
      customer_order:'',
      customer_dateoforder:'',
      customer_lowesstore:'',
      customer_doorname:'',
      customer_detail:'',
      date_created:'',
      date_modified:'',
      show_msg: false,
	  service_rows: [{
		id: "1",
		cabinet_qty: "",
		item_position: "",
		office_use: "",
		type_of_item: "",
		which_item_required: ""
	}]
    };

	this.state.removedlines = [];
    this.rtype = "add";
    this.id = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.users = new WarrantyOrderFormService();
	this.handleChangeSingle = this.handleChangeSingle.bind(this);
  }

  async componentWillMount() {
    this.rtype = qs.parse(this.props.location.search).type || "add";
    this.id = qs.parse(this.props.location.search).id || 0;

    if(this.rtype === "edit") {
      this.input_disabled = 'true';
      let result = await this.users.get(this.id);
      result = result.data;
      this.setState({
  		  customer_name:result.customer_name,
  		  customer_address:result.customer_address,
  		  customer_city:result.customer_city,
  		  customer_postalcode:result.customer_postalcode,
  		  customer_email:result.customer_email,
  		  customer_order:result.customer_order,
  		  customer_dateoforder:result.customer_dateoforder,
  		  customer_lowesstore:result.customer_lowesstore,
  		  customer_doorname:result.customer_doorname,
  		  customer_detail:result.customer_detail,
  		  service_rows:result.cabinetRowData
      });
    }
  }


  handleSubmit(e) {
    e.preventDefault();

    if(this.rtype === "edit") {
      this.input_disabled = true;
      this.users.update(this.id, 
						this.state.customer_name, 
						this.state.customer_address,
						this.state.customer_city,
						this.state.customer_postalcode,
						this.state.customer_email,
						this.state.customer_order,
						this.state.customer_dateoforder,
						this.state.customer_lowesstore,
						this.state.customer_doorname,
						this.state.customer_detail,
						this.state.service_rows,
						this.state.removedlines
						)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/warrantyorderform');
          }
          this.setState({"show_msg":true});
          this.alert_msg = res.msg;
        })
        .catch(err => {
          (err.message).then(data => {
            alert("Issue occurred."+data);
          });
      });
    }
    else {
		this.input_disabled = false;
		this.users.add( 
						this.state.customer_name, 
						this.state.customer_address,
						this.state.customer_city,
						this.state.customer_postalcode,
						this.state.customer_email,
						this.state.customer_order,
						this.state.customer_dateoforder,
						this.state.customer_lowesstore,
						this.state.customer_doorname,
						this.state.customer_detail,
						this.state.service_rows
					)
        .then(res => {

          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/warrantyorderform');
          }
          this.alert_msg = res.msg;
          this.setState({"show_msg":true});
        })
        .catch(err => {
          (err.message).then(data => {
            alert("Issue occurred."+data);
          });
      });
    }
    return false;
  }

	handleChangeSingle(e) {
		this.setState({"show_msg":false});
		this.setState({[e.target.name]: e.target.value});	
	}
	
	render_input_field(name, title, type){
		return(
			<Col xs="12">
				<FormGroup row>
					<Col md="3">
						<Label htmlFor={name}>{title}</Label>
					</Col>
					<Col xs="12" md="9">
						<Input type={type} id={name} name={name} placeholder={title} onChange={this.handleChangeSingle} defaultValue={this.state[name]} />
						<span className="text-danger">{this.err[name]}</span>
					</Col>
				</FormGroup>				  
			</Col>
		);
	}
	
	render_input_multiple(){
		  const elements = {cabinet_qty:2, type_of_item:3, which_item_required:2, item_position:3, office_use:2};
		  const items = [];
		  for (var i=0; i < 5; i++) {
			  for (const name in elements) {
				let dvalue = '';
				if((this.state.cabinetRowData).length >= i){
					dvalue = this.state.cabinetRowData[i][name];
				}
				items.push(<Col xs={elements[name]} key={'row'+i+name}>
						<FormGroup>
						  <Input type='text' name={name} row={this.state.cabinetRowData[i]['id']}  onChange={this.handleChangeGroup} defaultValue={dvalue}></Input>
						</FormGroup>
					</Col>)
			  }		
		  }		
		return(<Row>{items}</Row>);
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
	var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const item = {
	  id:id,
      cabinet_qty: "",
      type_of_item: "",
      which_item_required: "",
      item_position: "",
      office_use: ""
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
    return (
      <div className="react_table animated fadeIn product_selector">
      <Row>
     <div style={this.state.show_msg ? { } : {display: 'none'} }>
      <Alert color="success" >
        {this.alert_msg}
      </Alert>
      </div>	  
        <Col xs="10" lg="10" style={this.state.quote_submit === true ? { display: 'none' } : {display: 'block' } }>
          <Card>
            <CardHeader>
			
              <i className="fa fa-align-justify"></i> <strong>{(this.rtype === "add") ? "Add Warranty" : "Edit Warranty"}</strong> <Button type="submit" size="sm" color="primary" style={{'float':'right'}} onClick={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
            </CardHeader>
            <CardBody>

        <Form method="post" encType="multipart/form-data" className="form-horizontal warranty_from" onSubmit={this.handleSubmit}>
			<Row className="mb-3">
				<Col xs="6">
					<Col xs="12" className="mb-3"><h4>Customer Information</h4></Col>
					{this.render_input_field('customer_name', 'Name', 'text')}
					{this.render_input_field('customer_address', 'Address', 'text')}
					{this.render_input_field('customer_city', 'City/Province', 'text')}
					{this.render_input_field('customer_postalcode', 'Postal code', 'number')}
					{this.render_input_field('customer_email', 'Email Address', 'email')}
				</Col>
				<Col xs="6">
					<Col xs="12" className="mb-3"><h4>Original Order Information</h4></Col>
					{this.render_input_field('customer_order', 'Order #', 'text')}
					{this.render_input_field('customer_dateoforder', 'Date of Order', 'date')}
					{this.render_input_field('customer_lowesstore', 'Lowes Store', 'text')}
					{this.render_input_field('customer_doorname', 'Door Name', 'text')}
				</Col>				
			</Row>
			<Row>
				<Col xs="12">
					<p className="ml-3">Please make sure you have the Hugo&Borg warranty on hugoandborg.ca</p>
					<h4 className="text-center mb-3">Detailed Explanation for claim</h4>
					<Col xs="12" md="12">
						<Input type='text-area' id='customer_detail' style={{'height':'80px'}} name='customer_detail' onChange={this.handleChangeSingle} defaultValue={this.state.customer_detail}/>
					</Col>
				</Col>				
			</Row>

			
<Row>
<Col xs="12" className="mt-4 mb-2 text-right">
<Col xs="12">
 <div><Button className="btn btn-success btn-md ml-2" onClick={this.ServicehandleAddRow}>Add Row</Button></div>
</Col>
</Col>
</Row>          
<Row>            
<Col xs="12">            
<Col xs="12">            
			 <Table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center"> Qty: </th>
                    <th className="text-center"> Type of item (e.g) Door drawer front cover panel hinge</th>
                    <th className="text-center"> Which item is this required for </th>
                    <th className="text-center"> Hinging or Position of item on unit (e.g) Top left, middle, etc. </th>
                    <th className="text-center"> Hugo&Borg office use only</th>
					<th width="50" className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.service_rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx+1}</td>

<td>
	<Input
	  type="text"
	  name="cabinet_qty"
	  value={this.state.service_rows[idx].cabinet_qty}
	  onChange={this.ServicehandleChange(idx)}
	  className="form-control"
	/>
</td>
<td>
	<Input
	  type="text"
	  name="type_of_item"
	  value={this.state.service_rows[idx].type_of_item}
	  onChange={this.ServicehandleChange(idx)}
	  className="form-control"
	/>
</td>
<td>
	<Input
	  type="text"
	  name="which_item_required"
	  value={this.state.service_rows[idx].which_item_required}
	  onChange={this.ServicehandleChange(idx)}
	  className="form-control"
	/>
</td>
<td>
	<Input
	  type="text"
	  name="item_position"
	  value={this.state.service_rows[idx].item_position}
	  onChange={this.ServicehandleChange(idx)}
	  className="form-control"
	/>
</td>
<td>
	<Input
	  type="text"
	  name="office_use"
	  value={this.state.service_rows[idx].office_use}
	  onChange={this.ServicehandleChange(idx)}
	  className="form-control"
	/>
</td>

                      <td>
                        <Button className="btn btn-ghost-danger btn-md" onClick={this.ServicehandleRemoveSpecificRow(idx)} >
                          <i className="fa fa-trash" aria-hidden="true"></i></Button>
												
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
			  <Button type="submit" size="sm" color="primary" style={{'float':'right', 'marginTop':'15px'}}><i className="fa fa-dot-circle-o"></i> Submit</Button>
</Col>			  
</Col>			  
</Row>			  
			  
						
            
        </Form>			
			
            </CardBody>
          </Card>
        </Col>
		
		<Col xs="10" lg="10" style={this.state.quote_submit === true ? { display: 'block' } : {display: 'none' } }>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Product view and download 
            </CardHeader>
            <CardBody>		
			
            </CardBody>
          </Card>			
		</Col>
		
      </Row>
	 	 
	  
      </div>
    );
  }
}

export default AddUpdate;
