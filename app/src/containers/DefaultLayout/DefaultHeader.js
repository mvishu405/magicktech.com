import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Modal, ModalBody, ModalFooter, ModalHeader, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, FormText, Input, Label, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import { Link } from 'react-router-dom';

import {change_password_post_data} from '../../services/ChangePasswordService';
import {expire_data_req} from '../../services/ExpireService';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/min-logo.png'
const propTypes = {
  children: PropTypes.node,
};
	
const GLOBAL = require('../../constant');	
const defaultProps = {};
class DefaultHeader extends Component {

  constructor(props) {
    super(props);
	this.timer = 0;
    this.alert_msg = '-';
    this.err = '';	
	this.session_msg = '';
	this.exp_sess = [];
	this.user_logout = true;
    this.state = {
      user: JSON.parse(localStorage.getItem('userData')),
	  modal: false,
	  modal_cp: false,
	  modal_cp_timeout: false,
	  hide_model:false,
	  oldpassword : '',
	  newpassword : '',
	  expire_session : JSON.parse(localStorage.getItem('expire_session')), 
	  user_id: JSON.parse(localStorage.getItem('userData')).id,
	  warningTime: localStorage.getItem('warntime'),
      signoutTime: localStorage.getItem('exptime')
    };
	this.toggle = this.toggle.bind(this);
	this.toggle_cp = this.toggle_cp.bind(this);
	this.toggle_cp_timeout = this.toggle_cp_timeout.bind(this);
	this.expire_data_send = this.expire_data_send.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);		

  }

/* Expiry Session Time */
	componentDidMount() {
		this.check_token();
		this.resetTimeout();
		this.setTimeout();
		
	}
	clearTimeoutFunc = () => {
      if (this.warnTimeout) clearTimeout(this.warnTimeout);
      if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    };
	
	resetTimeout = () => {
      this.clearTimeoutFunc();
	  //this.state.signoutTime == localStorage.getItem('exptime');
    };
	
    setTimeout = () => {
     this.warnTimeout = setTimeout(this.warn, localStorage.getItem('warntime'));
     this.logoutTimeout = setTimeout(this.logout, localStorage.getItem('exptime'));
    };

    warn = () => {
		this.toggle_cp_timeout();	 
    };

    logout = () => {
	  this.destroy();
    };

    destroy = () => {
		localStorage.removeItem('userData'); 
		localStorage.removeItem('warntime'); 
		localStorage.removeItem('exptime'); 
		localStorage.removeItem('token'); 
		localStorage.removeItem('expire_seconds'); 
		window.location.href = 'logout_post';
		window.location.reload();
    };
  
	toggle() {
		this.setState({
		  modal: !this.state.modal,
		  hide_model: true
		});
	}
	toggle_cp() {
		this.setState({
		  modal_cp: !this.state.modal_cp,
		  hide_model: true
		});
	}

    toggle_cp_timeout() {		
		this.setState({
		  modal_cp_timeout: !this.state.modal_cp_timeout,
		  hide_model: true
		});
	}

	check_token(){
		var headers = {
			origin: ["*"],
			authorization:JSON.parse(localStorage.getItem('token'))
						
		};	
		return fetch(GLOBAL.BASE_URL+'api/v2/customers/check_token_post', {
			headers
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.success == false){
				this.destroy();
			}
		
		})
		.catch((error) =>{
		console.error(error);
		});		
	}
	
	expire_data_send(){
		let data = this.state;
		let token =  JSON.parse(localStorage.getItem('token'));
		let list = [{exp_data: data, token: token}];
		this.exp_sess = list;
		expire_data_req(this.exp_sess).then((responseJson) => {
			if(responseJson.success == true){
                localStorage.removeItem('warntime'); 
                localStorage.removeItem('exptime');
				
				localStorage.setItem('warntime',JSON.stringify(responseJson.expire_seconds) - 10000);
				localStorage.setItem('exptime',JSON.stringify(responseJson.expire_seconds));
				
				this.setState({ 
					modal_cp_timeout: !this.state.modal_cp_timeout,
					 hide_model: false,
					 warningTime: JSON.stringify(responseJson.expire_seconds) - 10000,
					 signoutTime: JSON.stringify(responseJson.expire_seconds)
				});
                this.componentDidMount();				
				
			}
		});
	}

    

	handleChange(e) {
		
		this.setState({[e.target.name]: e.target.value});
	}	
	handleSubmit(e) {
		
		e.preventDefault();
				 change_password_post_data('changepassword',this.state).then((responseJson) => {
					if(responseJson.success == false){
						this.err = responseJson.err;
						
					}else{
						this.err = '';
						 this.timeoutHandle = setTimeout(()=>{
							  this.toggle_cp();
						 }, 2000);						
					}					
					this.alert_msg = responseJson.msg;
					this.setState({"show_msg":true});
				});	
	}	
	
  render() {
	 
    const { children, ...attributes } = this.props;
	const default_img= "../../assets/dealerlogo/logo.png";
	const pathName= this.context.router.route.location.pathname;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 150, alt: 'MW Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'MW Logo' }}
        />
        <Nav className="d-md-down-none" navbar>
		  {(this.state.user.user_type != "SP" && this.state.user.user_type != "PS" && this.state.user.user_type != "WU") ?
          <NavItem className="px-3">
			<Link to="/customers" className={pathName == '/customers' ? 'is-active' : ''}>Customers</Link>
          </NavItem> :""}
		  
		  {(this.state.user.user_type != "SP" && this.state.user.user_type != "PS" && this.state.user.user_type != "WU") ?
			<NavItem className="px-3">
            <NavLink href="/quotelist" className={pathName == '/quotelist' ? 'is-active' : ''} >Quotes</NavLink>
			</NavItem> :""}
		  
          {(this.state.user.user_type == "SA") ?
          <NavItem className="px-3">
			<Link to="/dealers" className={pathName == '/dealers' ? 'is-active' : ''}>Dealers</Link>
          </NavItem> : ""}	
		  
          {(this.state.user.user_type == "SA") ?
          <NavItem className="px-3">
			<Link to="/accessories" className={pathName == '/accessories' ? 'is-active' : ''}>Accessories</Link>
          </NavItem> : ""}
		  
          {(this.state.user.user_type == "SA") ?
          <NavItem className="px-3">
			<Link to="/designer" className={pathName == '/designer' ? 'is-active' : ''}>Designers</Link>
          </NavItem> : ""}

          {(this.state.user.user_type == "SA") ?
          <NavItem className="px-3">
			<Link to="/component" className={pathName == '/component' ? 'is-active' : ''}>Components</Link>
          </NavItem> : ""}

          {(this.state.user.user_type == "SA") ?
          <NavItem className="px-3">
			<Link to="/codes" className={pathName == '/codes' ? 'is-active' : ''}>Codes</Link>
          </NavItem> : ""}	

          {(this.state.user.user_type == "SA") ?
          <NavItem className="px-3">
			<Link to="/pricemapping" className={pathName == '/pricemapping' ? 'is-active' : ''}>Manage Price</Link>
          </NavItem> : ""}

          {(this.state.user.user_type == "SP") ?
          <NavItem className="px-3">
			<Link to="/spoquote" className={pathName == '/spoquote' ? 'is-active' : ''}>SPO Quote</Link>
          </NavItem> : ""}

          {(this.state.user.user_type == "SP") ?
          <NavItem className="px-3">
			<Link to="/productselector" className={pathName == '/productselector' ? 'is-active' : ''}>Product Selector</Link>
          </NavItem> : ""}

          {(this.state.user.user_type == "WU") ?
          <NavItem className="px-3">
			<Link to="/warrantyorderform" className={pathName == '/warrantyorderform' ? 'is-active' : ''}>Warranty Order Form</Link>
          </NavItem> : ""}		  
		  
        </Nav>
        <Nav className="ml-auto" navbar>

          <AppHeaderDropdown direction="down" >
            <DropdownToggle className="bg_white my_account">
			  <span className="d-md-down-none">
				<NavLink>
				<img src={'../../assets/dealerlogo/dealerlogo_'+this.state.user.id+'.png'} onError={(e)=>{e.target.src=default_img}} className="img-avatar" style={{'borderRadius':'0'}} />			
				Welcome {(this.state.user.user_type == "SA") ? "Super Admin" : "Dealer"}: {this.state.user.user_name}<i className="fa fa-angle-down down_icon"></i></NavLink>
			  </span>			  
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem onClick={this.toggle_cp} ><i className="fa fa-key"></i> Change Password</DropdownItem>
              <DropdownItem onClick={this.toggle} ><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
		
		
		<Modal  isOpen={this.state.modal} toggle={this.toggle}>
		  <ModalHeader toggle={this.toggle}>Logout <i className="fa fa-lock"></i></ModalHeader>
		  <ModalBody>
			<i className="fa fa-question-circle"></i> Are you sure you want to logout?

		  </ModalBody>
			<ModalFooter>
				<Button className="btn btn-success" onClick={this.toggle} >Continue</Button>
				<Link to="/logout_post" className="btn btn-danger" onClick={this.logout}>Logout</Link>
			</ModalFooter>
		</Modal>
		
		<Modal  isOpen={this.state.modal_cp} toggle={this.toggle_cp}>
		  <ModalHeader toggle={this.toggle_cp}>Change Password <i className="fa fa-lock"></i></ModalHeader>
		  <ModalBody>

      <div className="animated fadeIn">
 
        <Form method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>

          <FormGroup row>
            <Col md="12">
              <Label htmlFor="text-input">Old Password</Label>
            </Col>
            <Col xs="12" md="12">
              <Input type="password" id="oldpassword" name="oldpassword" placeholder="Enter old password" onChange={this.handleChange} />
			  <span className="text-danger">{this.err.oldpassword}</span>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="12">
              <Label htmlFor="text-input">New Password</Label>
            </Col>
            <Col xs="12" md="12">
              <Input type="password" id="newpassword" name="newpassword" placeholder="Enter new password" onChange={this.handleChange} />
			  <span className="text-danger">{this.err.newpassword}</span>
            </Col>
          </FormGroup>		  

            <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
        </Form>

		<div className="alertmargin-20" style={this.state.show_msg ? { } : {display: 'none'} }>
			<Alert color="success" >
			{this.alert_msg}
			</Alert>
		</div>
	  
        

      </div>
		  
		  </ModalBody>
		</Modal>
		
		
		<Modal  isOpen={this.state.modal_cp_timeout} toggle={this.toggle}>
		  <ModalHeader toggle={this.toggle}>Logout <i className="fa fa-lock"></i></ModalHeader>
		  <ModalBody>
			<i className="fa fa-question-circle"></i> Your session will expire In 10 seconds.. Are you sure want to logout or Continue?
		  </ModalBody>
			<ModalFooter>
				<Button className="btn btn-success" onClick={this.expire_data_send}>Continue</Button>
				
			</ModalFooter>
		</Modal>
		
		
		
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

DefaultHeader.contextTypes = {
    router: PropTypes.object
};

export default DefaultHeader;
