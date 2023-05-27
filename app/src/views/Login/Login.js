import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import {login_post_data} from '../../services/LoginService';
//import {check_expiry_time} from '../../services/LoginService';


class Login extends Component {
	constructor(){
		super();
		this.alert_msg = '-';
		this.state = {
			email: '',
			password: '',
			redirectToReferrer: false,
			show_msg: false,
		};
		this.login = this.login.bind(this);
		this.onChange = this.onChange.bind(this);
		
	}
	

	login() {
		
		if(this.state.email != '' && this.state.password != ''){
			
			 login_post_data('login',this.state).then((responseJson) => {
				   
				this.alert_msg = responseJson.msg;
				if(responseJson.success == true){
					localStorage.setItem('userData',JSON.stringify(responseJson.data));
					localStorage.setItem('token',JSON.stringify(responseJson.token));
					localStorage.setItem('expire_session',responseJson.expire_session);
					localStorage.setItem('expire_seconds',responseJson.expire_seconds);

					localStorage.setItem('warntime',responseJson.expire_seconds - 10000);
					localStorage.setItem('exptime',responseJson.expire_seconds);
					this.setState({"show_msg":true, "redirectToReferrer":true});
					
				}else{
					
					this.setState({"show_msg":true});
				}
			});
		}
		
	}


	onChange(e){
		this.setState({"show_msg":false});
		this.setState({[e.target.name]:e.target.value});
	}

	render() {
	if (this.state.redirectToReferrer || localStorage.getItem('userData')){
		if(JSON.parse(localStorage.getItem('userData')).user_type === 'SP'){
			return (<Redirect to={'/spoquote'}/>)
		}else	if(JSON.parse(localStorage.getItem('userData')).user_type === 'WU'){
					return (<Redirect to={'/warrantyorderform'}/>)
		}else{
			return (<Redirect to={'/customers'}/>)
		}
	}


    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" placeholder="Email" name="email" onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="password" name="password" onChange={this.onChange}/>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
											<input type="submit" value="Login" className="btn btn-primary btn-block" onClick={this.login} />							
                      </Col>
                    </Row>
										<Row>
											
										<Col id="hide_msg" className="mt-3" style={this.state.show_msg ? { } : {display: 'none'} }>
							      <Alert color="danger" >
							        {this.alert_msg}
							      </Alert>
							      </Col>
								  
								  
								  
										</Row>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center flex-row align-items-center">
                    <div className="brandlogo">
                     <span><img src={'assets/img/logo.png'} /></span>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );

	}
}
export default Login;
