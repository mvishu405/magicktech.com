import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import CodesService from "../../services/CodesService";

import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from "lodash";

const qs = require("query-string");

class Manage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            pages: null,
            loading: true,
            list: [],
            user: JSON.parse(localStorage.getItem("userData")),
        };

        this.sno = 0;
        this.id = 0;
        this.CodesService = new CodesService();
        this.loadList = this.loadList.bind(this);
    }

    async componentDidMount() {
        await this.loadList();
    }
    async loadList() {
        let result = await this.CodesService.list();
        if (result.success == true) {
            this.setState({
                list: result.data,
            });
        }
    }
    beforeDelete(id) {
        if (window.confirm("Delete the item?")) {
            this.handleDelete(id);
        }
    }
    handleDelete(id) {
        this.CodesService.delete(id)
            .then((res) => {
                this.alert_msg = res.msg;
                if (res.success == true) {
                    alert(res.msg);
                    this.props.history.replace("/codes");
                    this.sno = 0;
                    this.loadList();
                }
            })
            .catch((err) => {
                err.message.then((data) => {
                    alert("Issue occurred." + data);
                });
            });
    }

    requestData(pageSize, page, sorted, filtered) {
        return new Promise((resolve, reject) => {
            let filteredData = this.state.list;

            console.log(`From`, filteredData);

            if (filtered.length) {
                filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                    return filteredSoFar.filter((row) => {
                        return (row[nextFilter.id] + "").includes(nextFilter.value);
                    });
                }, filteredData);
            }
            const sortedData = _.orderBy(
                filteredData,
                sorted.map((sort) => {
                    return (row) => {
                        if (row[sort.id] === null || row[sort.id] === undefined) {
                            return -Infinity;
                        }
                        return typeof row[sort.id] === "string" ? row[sort.id].toLowerCase() : row[sort.id];
                    };
                }),
                sorted.map((d) => (d.desc ? "desc" : "asc"))
            );

            const res = {
                rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
                pages: Math.ceil(filteredData.length / pageSize),
            };

            setTimeout(() => resolve(res), 300);
        });
    }

    state_instance(state, instance) {
        this.requestData(state.pageSize, state.page, state.sorted, state.filtered).then((res) => {
            this.setState({
                data: res.rows,
                pages: res.pages,
                loading: false,
            });
        });
    }

    fetchData(state, instance) {
        this.setState({ loading: true });

        if (state != undefined && this.state.list == "") {
            setTimeout(() => this.state_instance(state, instance), 1000);
        } else {
            if (state != undefined) {
                this.state_instance(state, instance);
            }
        }
    }

    render() {
        if (this.state.user.user_type != "SA") {
            return <Redirect to={"/customers"} />;
        }
        const { data, pages, loading, list } = this.state;

        console.log(`Render ${loading} =====>`, data, list);

        return (
            <div className="react_table animated fadeIn">
                <Row className="align-items-center">
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify" /> Code Lists
                                <Link to="/codes/add">
                                    <Button outline color="primary" className="float-right">
                                        Add Code
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    columns={[
                                        {
                                            Header: "Id",
                                            id: "id",
                                            maxWidth: 60,
                                            accessor: (d) => d.id,
                                            filterable: false,
                                            className: "text-center",
                                        },
                                        {
                                            Header: "Code",
                                            id: "code",
                                            maxWidth: 150,
                                            accessor: (d) => d.code,
                                        },
                                        {
                                            Header: "Description",
                                            id: "description",
                                            accessor: (d) => d.description,
                                        },
                                        {
                                            Header: "Width",
                                            id: "width",
                                            maxWidth: 70,
                                            accessor: (d) => d.width,
                                        },
                                        {
                                            Header: "Depth",
                                            id: "depth",
                                            maxWidth: 70,
                                            accessor: (d) => d.depth,
                                        },
                                        {
                                            Header: "Height",
                                            id: "height",
                                            maxWidth: 70,
                                            className: "text-center",
                                            accessor: (d) => d.height,
                                        },
                                        {
                                            Header: "Cabinet Type",
                                            id: "cabinet_type",
                                            maxWidth: 100,
                                            className: "text-center",
                                            accessor: (d) => d.cabinet_type,
                                        },
                                        {
                                            Header: "Action",
                                            id: "action",
                                            maxWidth: 120,
                                            className: "text-center",
                                            filterable: false,
                                            accessor: (d) => (
                                                <span>
                                                    <Link
                                                        to={"/codes/edit/?type=edit&id=" + d.id}
                                                        className="btn btn-ghost-info mr10 action_btn"
                                                    >
                                                        <i className="fa fa-edit" title="Edit" />
                                                    </Link>

                                                    <div
                                                        onClick={this.beforeDelete.bind(this, d.id)}
                                                        className="btn btn-ghost-danger action_btn"
                                                    >
                                                        <Link
                                                            to={"/codes/" + d.id}
                                                            title="Delete"
                                                            className="color_red"
                                                        >
                                                            <i className="fa fa-trash" />
                                                        </Link>
                                                    </div>
                                                </span>
                                            ),
                                        },
                                    ]}
                                    manual
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.fetchData.bind(this)}
                                    filterable
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                    loadingText="Loading..."
                                    style={{
                                        height: "650px",
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
