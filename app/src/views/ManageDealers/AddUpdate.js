import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col } from 'reactstrap';
import { Form, FormGroup, FormText, Input, Label, Alert } from 'reactstrap';
import DealersService from '../../services/DealersService';
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
      user_name:'',
      phone:'',
      email:'',
      logo:'',
      password:'',
      state:'',
      city:0,
      address:'',
      label:'',
      user_type:'',
      show_msg: false,
    };
    this.rtype = "add";
    this.id = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.users = new DealersService();
  }

  async componentWillMount() {
    this.rtype = qs.parse(this.props.location.search).type || "add";
    this.id = qs.parse(this.props.location.search).id || 0;

    if(this.rtype === "edit") {
      this.input_disabled = 'true';
      let result = await this.users.get(this.id);
      result = result.data;
      this.setState({
        user_name: result.user_name,
        phone: result.phone,
        email: result.email,
        logo: result.logo,
        password: result.password,
        address: result.address,
        state: result.state,
        city: result.city,
        user_type: result.user_type,
        last_login: result.last_login,
        date_created: result.date_created,
      });
    }
  }

  handleChange(e) {
    this.setState({"show_msg":false});
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.rtype === "edit") {
      this.input_disabled = true;
      this.users.update(this.id, this.state.user_name, this.state.logo, this.state.password, this.state.state, this.state.city, this.state.address, this.state.user_type)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/dealers');
          }
          //alert("Dealer Updated Successfully.");
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
      this.users.add(this.state.user_name, this.state.phone, this.state.email, this.state.logo, this.state.password, this.state.state, this.state.city, this.state.address, this.state.user_type, this.state.label)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/dealers');
          }
          this.alert_msg = res.msg;
          this.setState({"show_msg":true});
           //alert("Dealer Added Successfully.");
        })
        .catch(err => {
          (err.message).then(data => {
            alert("Issue occurred."+data);
          });
      });
    }
    return false;
  }

  handleChangeDropdown(type, e) {
	if(e != null){
		this.setState({[type]: e.value});
	}else{
		this.setState({[type]: '...Select'});
	}	
  }
  
  
  render() {

	const city_opt = [];
	const default_city_opt = [];
	
	Object.keys(GLOBAL.CITY).forEach(function(key) {
		var array = { value: key, label: GLOBAL.CITY[key] };
		default_city_opt[key] = array;
		return city_opt.push(array);		
	});
    return (
      <div className="animated fadeIn">
      <Col md="6">
      <Card>
        <CardHeader>
          <strong>{(this.rtype === "add") ? "Add Dealer" : "Edit Dealer"}</strong>
        </CardHeader>
        <CardBody>
        <Form method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Dealer Name</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="user_name" name="user_name" placeholder="" onChange={this.handleChange} defaultValue={this.state.user_name}/>
              <span className="text-danger">{this.err.user_name}</span>
            </Col>
          </FormGroup>
          <FormGroup row style={this.input_disabled ? {display: 'none'} : {} }>
            <Col md="3">
              <Label htmlFor="text-input">Phone</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="phone" name="phone" placeholder="" onChange={this.handleChange} defaultValue={this.state.phone}/>
              <span className="text-danger">{this.err.phone}</span>
            </Col>
          </FormGroup>		  
          <FormGroup row style={this.input_disabled ? {display: 'none'} : {} }>
            <Col md="3">
              <Label htmlFor="text-input">Email</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="email" id="email" name="email" placeholder="" onChange={this.handleChange} defaultValue={this.state.email}/>
              <span className="text-danger">{this.err.email}</span>
            </Col>
          </FormGroup>
          <FormGroup row style={{'display':'none'}}>
            <Col md="3">
              <Label htmlFor="text-input">Dealer Logo</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="file" id="logo" name="logo" placeholder="" onChange={this.handleChange} defaultValue={this.state.logo}/>
              <span className="text-danger">{this.err.logo}</span>
            </Col>
          </FormGroup>		  
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="date-input">Password</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="password" name="password" placeholder="" onChange={this.handleChange} defaultValue={this.state.password}/>
              <span className="text-danger">{this.err.password}</span>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">State</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="state" name="state" placeholder="" onChange={this.handleChange} defaultValue={this.state.state}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">City</Label>
            </Col>
            <Col xs="12" md="9">
			  	<Select
				isClearable
				name='city' id='city' value={default_city_opt[this.state.city]}  onChange={this.handleChangeDropdown.bind(this, 'city')}
				options={city_opt} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Address</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="address" name="address" placeholder="" onChange={this.handleChange} defaultValue={this.state.address}/>
            </Col>
          </FormGroup>
          <FormGroup row style={this.input_disabled ? {display: 'none'} : {} }>
            <Col md="3">
              <Label htmlFor="text-input">Label</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="label" name="label" maxlength="3" placeholder="" onChange={this.handleChange} defaultValue={this.state.label}/>
			  <span className="text-danger">{this.err.label}</span>
            </Col>
          </FormGroup>		  
          <FormGroup row style={{display: 'none'}}>
            <Col md="3">
              <Label htmlFor="select">Select Type</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="select" name="user_type" id="user_type" onChange={this.handleChange} defaultValue={'D'} value={this.state.user_type}>
                <option value="D" selected>Dealer</option>
                <option value="SA">Admin</option>
              </Input>
            </Col>
          </FormGroup>
            <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
        </Form>
        </CardBody>
      </Card>
      <div style={this.state.show_msg ? { } : {display: 'none'} }>
      <Alert color="success" >
        {this.alert_msg}
      </Alert>
      </div>
      </Col>
      </div>
    );
  }
}

export default AddUpdate;
