
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

const GLOBAL = require('../../constant');
let BaseURL = GLOBAL.BASE_URL+'api/v2/login/logout';
class Logout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: JSON.parse(localStorage.getItem('userData')).id,
			success:false
		};
	}	
	userLogout(){	
		return new Promise((resolve, reject) =>{
		fetch(BaseURL, {
			method: 'POST',
			body: JSON.stringify(this.state.user)
		}).then(
			response => response.json()
		).then((json) => {
			resolve(json);
			this.setState({"success":true})
		}).catch((error) => {
			reject(error);
		});
		});
	}	

   render() {
		localStorage.removeItem('userData');
		localStorage.removeItem('token');
		this.userLogout();
		if (this.state.success == true){
			return (<Redirect to={'/login'}/>)
		}		
    	return (<div></div>);
	 }
}
export default Logout;
