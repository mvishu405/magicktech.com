import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col } from 'reactstrap';
import { Form, FormGroup, FormText, Input, Label, Alert } from 'reactstrap';
import PricemappingService from '../../services/PricemappingService';
import CodesService from '../../services/CodesService';
import ComponentService from '../../services/ComponentService';
import Select from 'react-select';
const qs = require('query-string');

class AddUpdate extends Component {
  constructor(props) {
    super(props);
    this.alert_msg = '-';
    this.err = '';
    this.input_disabled = false;
    this.state = {
		get_codes:[],
		get_components:[],
		code_id:'',
		component_id:'',
		cost:'',
		date_created:'',
		date_modified:'',
		show_msg: false,
    };
    this.rtype = "add";
    this.id = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.users = new PricemappingService();
	this.CodesService = new CodesService();
	this.ComponentService = new ComponentService();
  }
	async componentDidMount() {
		let code_result = await this.CodesService.list();
		if(code_result.success == true){
		  this.setState({
			get_codes: code_result.data
		  });
		}

		let coomponent_result = await this.ComponentService.list();
		if(coomponent_result.success == true){
		  this.setState({
			get_components: coomponent_result.data
		  });
		}		
	}
  async componentWillMount() {
    this.rtype = qs.parse(this.props.location.search).type || "add";
    this.id = qs.parse(this.props.location.search).id || 0;
	
    if(this.rtype === "edit") {
      this.input_disabled = 'true';
      let result = await this.users.get(this.id);
      result = result.data;
      this.setState({
  		  code_id:result.code_id,
  		  component_id:result.component_id,
  		  cost:result.cost,
      });
    }	
  }
  handleChangeDropdown(type, e) {
	if(e != null){
		this.setState({[type]: e.value});
	}else{
		this.setState({[type]: '...Select'});
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
      this.users.update(
				this.id, 
				this.state.code_id, 
				this.state.component_id, 
				this.state.cost
				)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/pricemapping');
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
				this.state.code_id, 
				this.state.component_id, 
				this.state.cost
				)
        .then(res => {

          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/pricemapping');
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
	const code_opt = [];
	this.state.get_codes.map(function(d, idx){
		var arr = { value: d.id, label: d.code+' - '+d.description };
		return code_opt.push(arr);
	})

	const component_opt = [];
	this.state.get_components.map(function(d, idx){
		var arr = { value: d.id, label: d.component_type+' - '+d.component_name };
		return component_opt.push(arr);
	})	
	
    return (
      <div className="animated fadeIn">
      <Col md="6">
      <Card>
        <CardHeader>
          <strong>{(this.rtype === "add") ? "Add Price" : "Edit Price"}</strong>
        </CardHeader>
        <CardBody>
        <Form method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Select Code</Label>
            </Col>
            <Col xs="12" md="9">
				<Select
				isClearable
				name='code_id' id='code_id' value={code_opt[this.state.code_id]}  onChange={this.handleChangeDropdown.bind(this, 'code_id')}
				options={code_opt} />
				<span className="text-danger">{this.err.code_id}</span>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Select Component</Label>
            </Col>
            <Col xs="12" md="9">
				<Select
				isClearable
				name='component_id' id='component_id' value={component_opt[this.state.component_id]}  onChange={this.handleChangeDropdown.bind(this, 'component_id')}
				options={component_opt} />
				<span className="text-danger">{this.err.component_id}</span>
            </Col>
          </FormGroup>
    
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Cost</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="cost" name="cost" placeholder="" onChange={this.handleChange} defaultValue={this.state.cost}/>
			  <span className="text-danger">{this.err.cost}</span>
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
