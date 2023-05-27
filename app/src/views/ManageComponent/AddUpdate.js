import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col } from 'reactstrap';
import { Form, FormGroup, FormText, Input, Label, Alert } from 'reactstrap';
import ComponentService from '../../services/ComponentService';
import Select from 'react-select';
const qs = require('query-string');

const GLOBAL = require('../../constant');

class AddUpdate extends Component {
  constructor(props) {
    super(props);
    this.alert_msg = '-';
    this.err = '';
    this.input_disabled = false;
    this.state = {
      component_name:'',
      component_type:'',
      date_created:'',
      date_modified:'',
      show_msg: false,
    };
    this.rtype = "add";
    this.id = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.users = new ComponentService();
  }

  async componentWillMount() {
    this.rtype = qs.parse(this.props.location.search).type || "add";
    this.id = qs.parse(this.props.location.search).id || 0;

    if(this.rtype === "edit") {
      this.input_disabled = 'true';
      let result = await this.users.get(this.id);
      result = result.data;
      this.setState({
  		  component_name:result.component_name,
  		  component_type:result.component_type
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
      this.users.update(this.id, this.state.component_name, this.state.component_type)
        .then(res => {
          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/component');
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
      this.users.add(this.state.component_name, this.state.component_type)
        .then(res => {

          if(res.success == false){
            this.err = res.err;
          }else{
            this.props.history.replace('/component');
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
 
  handleChangeDropdown(type, e) {
	if(e != null){
		this.setState({[type]: e.value});
	}else{
		this.setState({[type]: '...Select'});
	}	
  } 

  render() {
	  
	const comp_type_opt = [];
	const default_comp_type_opt = [];
	
	Object.keys(GLOBAL.COMPONENT_TYPE).forEach(function(key) {
		var array = { value: key, label: GLOBAL.COMPONENT_TYPE[key] };
		default_comp_type_opt[key] = array;
		return comp_type_opt.push(array);		
	});	  

    return (
      <div className="animated fadeIn">
      <Col md="6">
      <Card>
        <CardHeader>
          <strong>{(this.rtype === "add") ? "Add Component" : "Edit Component"}</strong>
        </CardHeader>
        <CardBody>
        <Form method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Name</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="component_name" name="component_name" placeholder="" onChange={this.handleChange} defaultValue={this.state.component_name}/>
              <span className="text-danger">{this.err.component_name}</span>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Component Type</Label>
            </Col>
            <Col xs="12" md="9">
			  	<Select
				isClearable
				name='component_type' id='component_type' value={default_comp_type_opt[this.state.component_type]}  onChange={this.handleChangeDropdown.bind(this, 'component_type')}
				options={comp_type_opt} />			
             
			  <span className="text-danger">{this.err.component_type}</span>
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
