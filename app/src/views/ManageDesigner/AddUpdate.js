import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col } from 'reactstrap';
import { Form, FormGroup, FormText, Input, Label, Alert } from 'reactstrap';
import DesignerService from '../../services/DesignerService';
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
      date_created:'',
      date_modified:'',
      show_msg: false,
    };
    this.rtype = "add";
    this.id = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.users = new DesignerService();
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
  		  phone:result.phone
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
      this.users.update(this.id, this.state.name, this.state.email, this.state.phone)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/designer');
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
      this.users.add(this.state.name, this.state.email, this.state.phone)
        .then(res => {

          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/designer');
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

  render() {

    return (
      <div className="animated fadeIn">
      <Col md="6">
      <Card>
        <CardHeader>
          <strong>{(this.rtype === "add") ? "Add Designer" : "Edit Designer"}</strong>
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
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Email</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="mail" id="email" name="email" placeholder="" onChange={this.handleChange} defaultValue={this.state.email}/>
			  <span className="text-danger">{this.err.email}</span>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Phone</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="number" id="phone" name="phone" placeholder="" onChange={this.handleChange} defaultValue={this.state.phone}/>
			  <span className="text-danger">{this.err.phone}</span>
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
