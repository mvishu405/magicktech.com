import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import ComponentService from '../../services/ComponentService';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import _ from "lodash";

const qs = require('query-string');

class Manage extends Component {
  constructor(props) {
    super(props);

    this.state = {
		data: [],
		pages: null,
		loading: true,	
		list: [],
		user: JSON.parse(localStorage.getItem('userData')),
    };

    this.sno = 0;
    this.id = 0;
    this.ComponentService = new ComponentService();
    this.loadList = this.loadList.bind(this);
  }

  async componentWillMount() {
    await this.loadList();
  }
  async loadList(){
    let result = await this.ComponentService.list();
    if(result.success == true){
      this.setState({
        list: result.data
      });
    }
  }
  beforeDelete(id){
	if((window.confirm("Delete the item?"))){ this.handleDelete(id); }
  }
  handleDelete(id) {
      this.ComponentService.delete(id)
      .then(res => {
        this.alert_msg = res.msg;
        if(res.success == true){
           alert(res.msg);
           this.props.history.replace('/component');
           this.sno = 0;
           this.loadList();
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
              <i className="fa fa-align-justify"></i> Component Lists
              <Link to="/component/add">
              <Button outline color="primary" className="float-right">Add Component</Button>
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
						  Header: "Component Name",
						  id: "component_name",
						  accessor: d => d.component_name
						},
						{
						  Header: "Component Type",
						  id: "component_type",
						  maxWidth: 100,
						  accessor: d => d.component_type
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
							<Link to={"/component/edit/?type=edit&id="+d.id} className="btn btn-ghost-info mr10 action_btn"><i className="fa fa-edit"  title="Edit"></i></Link>

							<div onClick={this.beforeDelete.bind(this, d.id)} className="btn btn-ghost-danger action_btn"><Link to={"/component/"+d.id} title="Delete" className="color_red"><i className="fa fa-trash"></i></Link></div>
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
