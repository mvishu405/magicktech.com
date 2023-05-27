import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router-dom';

import ReactTable from "react-table";
import 'react-table/react-table.css';
import _ from "lodash";
import PricemappingService from '../../services/PricemappingService';

const qs = require('query-string');

class Manage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      data: [],
      pages: null,
      loading: true,
      user: JSON.parse(localStorage.getItem('userData')),
    };

    this.sno = 0;
    this.id = 0;
    this.PricemappingService = new PricemappingService();
  }

  
  beforeDelete(id){
	if((window.confirm("Delete the item?"))){ this.handleDelete(id); }
  }
  handleDelete(id) {
      this.PricemappingService.delete(id)
      .then(res => {
        this.alert_msg = res.msg;
        if(res.success == true){
           alert(res.msg);
           this.props.history.replace('/pricemapping');
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
 
	fetchData(state, instance) {
		this.setState({ loading: true });
		this.PricemappingService.list(
			state.page,
			state.pageSize,
			state.sorted,
			state.filtered
		).then(res => {
			if(res.success == true){
				this.setState({
				data: res.data,
				pages: Math.ceil(res.total_records/state.pageSize),
				loading: false
				});
			}
		})
		.catch(err => {
		  (err.message).then(data => {
			alert("Issue occurred."+data);
		  });
		}); 
				
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
              <i className="fa fa-align-justify"></i> Price Lists
              <Link to="/pricemapping/add">
              <Button outline color="primary" className="float-right">Add Price</Button>
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
                  Header: "Code",
				  id: "code",
				  maxWidth: 150,
                  accessor: d => d.code
                },
                {
                  Header: "Code Name",
				  id: "description",
                  accessor: d => d.description				  
                },
                {
                  Header: "Component Type",
                  id: "component_type",
				  maxWidth: 150,
                  accessor: d => d.component_type
                },				
                {
                  Header: "Component Name",
                  id: "component_name",
				  maxWidth: 150,
                  accessor: d => d.component_name
                },
                {
                  Header: "Cost",
                  id: "cost",
				  maxWidth: 100,
				  className: "text-center",
                  accessor: d => d.cost,
				  filterable:false,
                },
                {
                  Header: "Action",
                  id: "action",
				  maxWidth: 120,
				  className: "text-center",
				  filterable:false,
				  accessor: d => (
				    <span>
					<Link to={"/pricemapping/edit/?type=edit&id="+d.id} className="btn btn-ghost-info mr10 action_btn"><i className="fa fa-edit"  title="Edit"></i></Link>

					<div onClick={this.beforeDelete.bind(this, d.id)} className="btn btn-ghost-danger action_btn"><Link to={"/pricemapping/"+d.id} title="Delete" className="color_red"><i className="fa fa-trash"></i></Link></div>
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
