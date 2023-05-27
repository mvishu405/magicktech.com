import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import DesignerService from '../../services/DesignerService';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import _ from "lodash";

const qs = require('query-string');

class Manage extends Component {
  constructor(props) {
    super(props);
	this.alert_msg = '';
    this.state = {
		data: [],
		pages: null,
		loading: true,			
		list: [],
		user: JSON.parse(localStorage.getItem('userData')),
		modal_d: false,
		hide_model:false,
		show_msg:false,
    };

    this.sno = 0;
    this.id = 0;
    this.DesignerService = new DesignerService();
    this.loadList = this.loadList.bind(this);
	
	this.toggle_d = this.toggle_d.bind(this);
  }
 
	toggle_d() {
		this.setState({
		  modal_d: !this.state.modal_d,
		  hide_model: true
		});
	} 
	
	async componentWillMount() {
		await this.loadList();
	}
	
	async loadList(){
		let result = await this.DesignerService.list();
		if(result.success == true){
		  this.setState({
			list: result.data
		  });
		}
	}
	
	
	handleDelete(id) {  
	   this.DesignerService.delete(id)
	  .then(res => {
		this.alert_msg = res.msg;
		this.setState({"show_msg":true});
		
		if(res.success == true){
			this.sno = 0;
			this.err = '';
			this.alert_msg = res.msg;			
			 this.timeoutHandle = setTimeout(()=>{
				window.location.reload(); 						 
				this.toggle_d();
				
			 }, 2000);			

		}
	  })
	  .catch(err => {
		(err.message).then(data => {
		  alert("Issue occurred."+data);
		});
	  });
	}

	requestData (pageSize, page, sorted, filtered){	
	  return new Promise((resolve, reject) => {
		let filteredData = this.state.list;

		if (filtered.length) {
		  filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
			return filteredSoFar.filter(row => {
			  return (row[nextFilter.id] + "").includes(nextFilter.value);
			});
		  }, filteredData);
		}
		const sortedData = _.orderBy(
		  filteredData,
		  sorted.map(sort => {
			return row => {
			  if (row[sort.id] === null || row[sort.id] === undefined) {
				return -Infinity;
			  }
			  return typeof row[sort.id] === "string"
				? row[sort.id].toLowerCase()
				: row[sort.id];
			};
		  }),
		  sorted.map(d => (d.desc ? "desc" : "asc"))
		);

		const res = {
		  rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
		  pages: Math.ceil(filteredData.length / pageSize)
		};

		setTimeout(() => resolve(res), 300);
	  });
	} 
 
	state_instance(state, instance){
		this.requestData(
			state.pageSize,
			state.page,
			state.sorted,
			state.filtered
		).then(res => {
			this.setState({
			data: res.rows,
			pages: res.pages,
			loading: false
			});

		})
	} 

	fetchData(state, instance) { 		
		this.setState({ loading: true });
		if(state != undefined && this.state.list == ''){
			setTimeout(() => this.state_instance(state, instance), 1000);
		}else{
			if(state != undefined){ 
				this.state_instance(state, instance)
			}
		}
	}	      	

  render() {
    if(this.state.user.user_type != "SA"){
      return (<Redirect to={'/customers'}/>)
    }
	
	const { data, pages, loading } = this.state;
	
    return (
      <div className="react_table animated fadeIn">
      <Row className="align-items-center">
        <Col xs="12" lg="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Designer List
              <Link to="/designer/add">
              <Button outline color="primary" className="float-right">Add Designer</Button>
              </Link>
            </CardHeader>
            <CardBody>
			   <ReactTable 
				  columns={[
						{
						  Header: "Id",
						  id: "id",
						  maxWidth: 60,
						  accessor: d => d.id,
						  filterable:false,
						  className: "text-center"
						},
						{
						  Header: "Name",
						  id: "name",
						  accessor: d => d.name
						},
						{
						  Header: "Email",
						  id: "email",
						  accessor: d => d.email
						},
						{
						  Header: "Phone",
						  id: "phone",
						  accessor: d => d.phone
						},
						{
						  Header: "Created",
						  id: "date_created",
						  maxWidth: 100,
						  accessor: d => d.date_created,
						  filterable:false
						},
						{
						  Header: "Modified",
						  id: "date_modified",
						  maxWidth: 100,
						  accessor: d => d.date_modified,
						  filterable:false
						},						
						{
						  Header: "Action",
						  id: "action",
						  maxWidth: 120,
						  className: "text-center",
						  filterable:false,
						  accessor: d => (
							<span>
								<Link to={"/designer/edit/?type=edit&id="+d.id} className="btn btn-ghost-info mr10"><i className="fa fa-edit"  title="Edit"></i></Link>

								<div onClick={this.toggle_d} className="btn btn-ghost-danger"><div title="Delete" className="color_red"><i className="fa fa-trash"></i></div></div>
								
								<Modal  isOpen={this.state.modal_d} toggle={this.toggle_d}>
								  <ModalHeader toggle={this.toggle_d}>Delete <i className="fa fa-trash"></i></ModalHeader>
								  <ModalBody>
									<i className="fa fa-question-circle"></i> Are you sure you want to delete designer?
									<div className="alertmargin-20" style={this.state.show_msg ? { } : {display: 'none'} }>
										<Alert color="success" >
										{this.alert_msg}
										</Alert>
									</div>
								  </ModalBody>
									<ModalFooter>
										<Button className="btn btn-success" onClick={this.toggle_d} >Cancel</Button>
										<Button className="btn btn-danger" onClick={this.handleDelete.bind(this, d.id)} >Delete</Button>
									</ModalFooter>
								</Modal>
							</span>
						  )				  
						}				
					  
				  ]}

				  manual
				  data={data}
				  pages={pages}
				  loading={loading}
				  onFetchData={this.fetchData.bind(this)}
				  filterable			  
				  defaultPageSize={10}
				  className="-striped -highlight"
					loadingText= 'Loading...'
					style={{
						height: "650px"
					}}
				/>
            </CardBody>
          </Card>
        </Col>
      </Row>
	 	 
	  
      </div>
    );
  }
}

export default Manage;
