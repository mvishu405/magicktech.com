import React, { Component, useState } from "react";

// class ManageCategories extends Component {
//     constructor(props) {
//         super(props);
//     }

//     state = {};

//     render() {
//         return (
//             <div className="animated fadeIn">
//                 <Col md="6">
//                     <Card>
//                         <CardHeader>
//                             <strong>{this.rtype === "add" ? "Add Code" : "Edit Code"}</strong>
//                         </CardHeader>
//                         <CardBody>
//                             <Form
//                                 method="post"
//                                 encType="multipart/form-data"
//                                 className="form-horizontal"
//                                 onSubmit={this.handleSubmit}
//                             >
//                                 <FormGroup row>
//                                     <Col md="3">
//                                         <Label htmlFor="text-input">Code</Label>
//                                     </Col>
//                                     <Col xs="12" md="9">
//                                         <Input
//                                             type="text"
//                                             id="code"
//                                             name="code"
//                                             placeholder=""
//                                             onChange={this.handleChange}
//                                             defaultValue={this.state.code}
//                                         />
//                                         <span className="text-danger">{this.err.code}</span>
//                                     </Col>
//                                 </FormGroup>
//                                 <FormGroup row>
//                                     <Col md="3">
//                                         <Label htmlFor="text-input">Description</Label>
//                                     </Col>
//                                     <Col xs="12" md="9">
//                                         <Input
//                                             type="text"
//                                             id="description"
//                                             name="description"
//                                             placeholder=""
//                                             onChange={this.handleChange}
//                                             defaultValue={this.state.description}
//                                         />
//                                         <span className="text-danger">{this.err.description}</span>
//                                     </Col>
//                                 </FormGroup>
//                                 <FormGroup row>
//                                     <Col md="3">
//                                         <Label htmlFor="text-input">Width</Label>
//                                     </Col>
//                                     <Col xs="12" md="9">
//                                         <Input
//                                             type="number"
//                                             id="width"
//                                             name="width"
//                                             placeholder=""
//                                             onChange={this.handleChange}
//                                             defaultValue={this.state.width}
//                                         />
//                                         <span className="text-danger">{this.err.width}</span>
//                                     </Col>
//                                 </FormGroup>
//                                 <FormGroup row>
//                                     <Col md="3">
//                                         <Label htmlFor="text-input">Depth</Label>
//                                     </Col>
//                                     <Col xs="12" md="9">
//                                         <Input
//                                             type="number"
//                                             id="depth"
//                                             name="depth"
//                                             placeholder=""
//                                             onChange={this.handleChange}
//                                             defaultValue={this.state.depth}
//                                         />
//                                         <span className="text-danger">{this.err.depth}</span>
//                                     </Col>
//                                 </FormGroup>
//                                 <FormGroup row>
//                                     <Col md="3">
//                                         <Label htmlFor="text-input">Height</Label>
//                                     </Col>
//                                     <Col xs="12" md="9">
//                                         <Input
//                                             type="number"
//                                             id="height"
//                                             name="height"
//                                             placeholder=""
//                                             onChange={this.handleChange}
//                                             defaultValue={this.state.height}
//                                         />
//                                         <span className="text-danger">{this.err.height}</span>
//                                     </Col>
//                                 </FormGroup>
//                                 <FormGroup row>
//                                     <Col md="3">
//                                         <Label htmlFor="text-input">Cabinet Type</Label>
//                                     </Col>
//                                     <Col xs="12" md="9">
//                                         <Select
//                                             isClearable
//                                             name="cabinet_type"
//                                             id="cabinet_type"
//                                             value={default_type_opt[this.state.cabinet_type]}
//                                             onChange={this.handleChangeDropdown.bind(this, "cabinet_type")}
//                                             options={cabinet_type_opt}
//                                         />
//                                         <span className="text-danger">{this.err.cabinet_type}</span>
//                                     </Col>
//                                 </FormGroup>

//                                 <Button type="submit" size="sm" color="primary">
//                                     <i className="fa fa-dot-circle-o" /> Submit
//                                 </Button>
//                             </Form>
//                         </CardBody>
//                     </Card>
//                     <div style={this.state.show_msg ? {} : { display: "none" }}>
//                         <Alert color="success">{this.alert_msg}</Alert>
//                     </div>
//                 </Col>
//             </div>
//         );
//     }
// }

const ManageCategories = () => {
    const [a] = useState([]);
    return (
        <>
            Vishal Shukla KKMMMM <h1>KKK</h1>
        </>
    );
};

export default ManageCategories;
