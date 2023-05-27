import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col } from 'reactstrap';
import { Form, FormGroup, FormText, Input, Label, Alert } from 'reactstrap';
import CustomersService from '../../services/CustomersService';

const qs = require('query-string');

class AddUpdate extends Component {
  constructor(props) {
    super(props);
    this.alert_msg = '-';
    this.err = '';
    this.input_disabled = false;
    this.state = {
      name:'',
      email:'',
      phone:'',
      alternate_phone:'',
      state:'',
      city:'',
      address:'',
      comments:'',
      lead_source:'',
      date_created:'',
      show_msg: false,
    };
    this.rtype = "add";
    this.id = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logged_in = JSON.parse(localStorage.getItem('userData'));
    this.users = new CustomersService();
  }

  async componentWillMount() {
    this.rtype = qs.parse(this.props.location.search).type || "add";
    this.id = qs.parse(this.props.location.search).id || 0;

    if(this.rtype === "edit") {
      this.input_disabled = 'true';
      let result = await this.users.get(this.id);
      result = result.data;
      this.setState({
		  name:result.name,
		  email:result.email,
		  phone:result.phone,
		  alternate_phone:result.alternate_phone,
		  state:result.state,
		  city:result.city,
		  address:result.address,
		  comments:result.comments,
		  lead_source:result.lead_source,
		  date_created:result.date_created,
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
      this.users.update(this.id, this.state.name, this.state.alternate_phone, this.state.state, this.state.city, this.state.address, this.state.comments, this.state.lead_source)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/customers');
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
      this.users.add(this.state.name, this.state.email, this.state.phone, this.state.alternate_phone, this.state.state, this.state.city, this.state.address, this.state.comments, this.state.lead_source, this.logged_in.id)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/customers');
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

  render() {
console.log(this.logged_in.id);    


    return (
      <div className="animated fadeIn">
      <Col md="6">
      <Card>
        <CardHeader>
          <strong>{(this.rtype === "add") ? "Add Customer" : "Edit Customer"}</strong>
        </CardHeader>
        <CardBody>
        <Form method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Name</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="name" name="name" placeholder="" onChange={this.handleChange} defaultValue={this.state.name}/>
              <span className="text-danger">{this.err.name}</span>
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
          <FormGroup row style={this.input_disabled ? {display: 'none'} : {} }>
            <Col md="3">
              <Label htmlFor="text-input">Phone</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="phone" name="phone" placeholder="" onChange={this.handleChange} defaultValue={this.state.phone}/>
              <span className="text-danger">{this.err.phone}</span>
            </Col>
          </FormGroup>
          <FormGroup row >
            <Col md="3">
              <Label htmlFor="text-input">Alternate Phone</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="alternate_phone" name="alternate_phone" placeholder="" onChange={this.handleChange} defaultValue={this.state.alternate_phone}/>
              <span className="text-danger">{this.err.alternate_phone}</span>
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
              <Input type="text" id="city" name="city" placeholder="" onChange={this.handleChange} defaultValue={this.state.city}/>
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
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Comments</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="comments" name="comments" placeholder="" onChange={this.handleChange} defaultValue={this.state.comments}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Lead Source</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="lead_source" name="lead_source" placeholder="" onChange={this.handleChange} defaultValue={this.state.lead_source}/>
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
