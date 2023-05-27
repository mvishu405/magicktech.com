import React, { Component } from 'react';
import { NavLink, Button, Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, TabContent, TabPane, NavItem, Nav, Alert} from 'reactstrap';
import Select from 'react-select'
import {Redirect} from 'react-router-dom';
//import {Link} from 'react-router-dom';
import product_selector from './product_selector.json';

import ppdJson from '../SpoQuote/price_master_ppd.json';
import mvtJson from '../SpoQuote/price_master_mvt.json';
import retailJson from '../SpoQuote/price_master_retail.json';

import $ from 'jquery';

const groupStyles = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
};
const groupBadgeStyles = {
	backgroundColor: '#EBECF0',
	borderRadius: '2em',
	color: '#172B4D',
	display: 'inline-block',
	fontSize: 12,
	fontWeight: 'normal',
	lineHeight: '1',
	minWidth: 1,
	padding: '0.16666666666667em 0.5em',
	textAlign: 'center',
};

const formatGroupLabel = data => (
	<div style={groupStyles}>
	<span>{data.label}</span>
	<span style={groupBadgeStyles}>{data.options.length}</span>
	</div>
);

const three_type = {"Cappuccino":"standard", "Gray Mist":"premium", "Pewter":"standard", "Solid White":"basic", "White Swirl":"basic"}

const key_title = {
"matte_finish":"Matte finish",
"gloss_finish":"Gloss finish",
"oval_non_recessed":"Oval Non-Recessed",
"oval_recessed":"Oval Recessed",
"oval_undermount":"Oval Undermount",
"rectangle_undermount":"Rectangle Undermount",
"luna":"Luna",
"wave":"Wave",
"contemporary":"Contemporary",
"slab_top":"Slab Top",
"same_as_top_finish":"Same as top finish",
"white":"White",
"biscuit":"Biscuit",
"single_centered":"Single Centered",
"double_bowl":"Double-bowl",
"offset_bowl_left":"Single Offset (left sink)",
"offset_bowl_right":"Single Offset (right sink)",
"none":"None",
"4":"4'",
"8":"8'",
"single":"Single",
"no_backsplash":"No backsplash",
"4_separate_backsplash":"4' Separate backsplash",
"no_overflow":"Without Overflow",
"with_overflow":"With Overflow",
"left_side_splash4":"Left side splash (4')",
"right_side_splash":"Right side splash (4')",
"left_side_splash35":"Left side splash (3-1/2')",
"right_side_splash35":"Right side splash (3-1/2')",
"uss_1":"Universal side splash(3-1/2)  1",
"uss_2":"Universal side splash(3-1/2) 2",
"side_splash_1":"Universal side splash(4) 1",
"side_splash_2":"Universal side splash(4) 2",
"no_side_splash":"No side splash"
};

class Manage extends Component {
	constructor(props) {
		super(props);
				
		this.alert_msg = '';
		this.selected_spo = {};
		this.state = {
			data: [],			
			user: JSON.parse(localStorage.getItem('userData')),
			quote_submit:false,
			filter_stock:{},
			filter_finish:{},
			filter_width_depth:{},
			filter_bowl_style:{},
			selected:{},
			selected_arr:{},
			ppd_price:0,
			mvt_price:0,
			retail_price:0,
			activeTab: new Array(3).fill('2'),
			addClass_SPO: false,
			show_spo:false
		};
		

		this.individual_ppd = [];
		this.individual_ppd['bowl_style']=0;
		this.individual_ppd['matte_finish']=0;
		this.individual_ppd['biscuit']=0;
		this.individual_ppd['bowl_location']=0;
		this.individual_ppd['backsplash']=0;
		this.individual_ppd['side_splash']=0;
		this.individual_ppd['faucet_center']=0;
		this.individual_ppd['overflow']=0
		
		this.individual_mvt = [];
		this.individual_mvt['bowl_style']=0;
		this.individual_mvt['matte_finish']=0;
		this.individual_mvt['biscuit']=0;
		this.individual_mvt['bowl_location']=0;
		this.individual_mvt['backsplash']=0;
		this.individual_mvt['side_splash']=0;
		this.individual_mvt['faucet_center']=0;
		this.individual_mvt['overflow']=0;

		this.individual_retail = [];
		this.individual_retail['bowl_style']=0;
		this.individual_retail['matte_finish']=0;
		this.individual_retail['biscuit']=0;
		this.individual_retail['bowl_location']=0;
		this.individual_retail['backsplash']=0;
		this.individual_retail['side_splash']=0;
		this.individual_retail['faucet_center']=0;
		this.individual_retail['overflow']=0;	
		
		this.total_price_SPO=[];
		this.total_price_SPO['ppdPrice'] = 0;
		this.total_price_SPO['mvtPrice'] = 0;
		this.total_price_SPO['retailPrice'] = 0;
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		
	}

	toggle_tab(tabPane, tab) {
		const newArray = this.state.activeTab.slice()
		newArray[tabPane] = tab
		this.setState({
		  activeTab: newArray,
		});
	}		

	handleChange(e) {
		const selected = this.state.selected;
		selected[e.target.name] = e.target.value;
		this.setState({selected});
		this.check_condition(e.target.name);
		this.reload_selected_value(e.target.name);
	}
	handleChangeSelect(key, e) {
		const selected = this.state.selected;
		const selected_arr = this.state.selected_arr;selected_arr[key] = e;
		selected[key] = e.value;
		this.reload_selected_value(key);
		if(e.type){
			selected['type'] = e.type;
		}
		this.setState({selected});
		this.setState({selected_arr});
		this.check_condition(key);
	}
	reset_dropdown(name){
		let selected_arr = this.state.selected_arr;
		selected_arr[name] = {value: "0", label: "Select.."};
		this.setState({selected_arr});
	}
	reload_selected_value(select_type){
		const selected = this.state.selected;
		if(select_type == 'stock'){
			selected['finish'] = '';selected['bowl_style'] = '';selected['dimention'] = '';
			this.reset_dropdown('finish');
			this.reset_dropdown('bowl_style');
			this.reset_dropdown('dimention');
			this.setState({filter_bowl_style:'', filter_width_depth:''});
			this.setState({selected});				
		}
		if(select_type == 'finish'){
			selected['bowl_style'] = '';selected['dimention'] = '';		
			this.reset_dropdown('bowl_style');
			this.reset_dropdown('dimention');			
			this.setState({filter_bowl_style:'', filter_width_depth:''});
			this.setState({selected});			
		}
		if(select_type == 'bowl_style'){
			
			selected['dimention'] = '';
			this.reset_dropdown('dimention');
			this.setState({filter_width_depth:''});
			this.setState({selected});
		}		
	}
		
	handleSubmit(e) {
		e.preventDefault();	
		if(this.state.selected.dimention !== undefined && this.state.selected.dimention !== ''){
			this.get_total_price();
			this.setState({quote_submit:true});
		}else{
			alert('All field are required!');
		}
	}
	
	handleSubmitSku() {	
		
		const selected = this.state.selected;
		if(this.state.selected.search_sku == undefined){
			alert('SKU not found!');
		}else if(this.state.selected.search_sku !== ''){
			this.setState({quote_submit:true});
			for(var key in product_selector){
				if(product_selector[key]['sku'] == this.state.selected.search_sku){
					var total = product_selector[key];
					selected['dimention'] = key;
				}
				if(product_selector[key]['image_id'] == this.state.selected.search_sku){
					var total = product_selector[key];
					selected['dimention'] = key;
				}				
			}
			selected['stock'] = total['stock'];
			selected['finish'] = total['finish'];
			selected['bowl_style'] = total['bowl_style'];
			this.setState({selected});	
			this.setState({ppd_price:total.ppd_price, retail_price:total.retail_price, mvt_price:total.mvt_price});		
		}else{
			alert('SKU not found!');
		}
	}	

   
	
	handleChangeAfterSubmit(type, e) {
		this.state.addClass_SPO = false;
		this.setState({quote_submit:false});
	}
	
	field_row_list(field, name){
		var dimention = '';
		var selected_value = this.state.selected[field];
		if(product_selector[this.state.selected.dimention] !== undefined && field === 'dimention'){
			dimention = product_selector[this.state.selected.dimention];
			selected_value = dimention.w+'X'+dimention.d;
		}			
			
		return(
			<ListGroupItem className={this.state.selected[field] !== undefined && this.state.selected[field] !== '' ? "fill":""}><span>{name}: </span>{selected_value}</ListGroupItem>
		);
	}
	RenderPricearea(price_type, title, total_price){
				
		return(
		<Card>
		<CardHeader className="text-center total_price_main">
			<span className="strip">Product Selector</span>
			<span style={{'fontSize':'20px'}}>Estimated {title}: </span> <i className="fa fa-dollar"></i> <span className="total_price">{total_price}</span>
		</CardHeader>							
		<CardBody className="pricearea">
			<Row>
				<Col md='12'>
				<ListGroup>
				{this.field_row_list('stock', 'Program')}
				{this.field_row_list('finish', 'Finish')}
				{this.field_row_list('bowl_style', 'Bowl Style')}
				{this.field_row_list('dimention', 'Dimension')}
				</ListGroup>
				
				</Col>
			</Row>
		</CardBody>
		</Card>
		);	
	}


	get_total_price(){
		var total = product_selector[this.state.selected.dimention];
		this.setState({ppd_price:total.ppd_price, retail_price:total.retail_price, mvt_price:total.mvt_price});
	}
	
	PriceTab(){	
		var ppd_price = this.state.ppd_price;
		var retail_price = this.state.retail_price;
		var mvt_price = this.state.mvt_price;
		return(<div>
				<Nav tabs>
				  <NavItem>
					<NavLink
					  active={this.state.activeTab[0] === '2'}
					  onClick={() => { this.toggle_tab(0, '2'); }}
					>
					  PPD Price
					</NavLink>
				  </NavItem>
				  <NavItem>
					<NavLink
					  active={this.state.activeTab[0] === '3'}
					  onClick={() => { this.toggle_tab(0, '3'); }}
					>
					  Retail Price
					</NavLink>
				  </NavItem>
				  
				</Nav>
				<TabContent activeTab={this.state.activeTab[0]} className="listing">
					<TabPane tabId="2">
						{this.RenderPricearea('ppd_price', 'PPD Price', ppd_price)}
					</TabPane>
					<TabPane tabId="3">
						{this.RenderPricearea('retail_price', 'Retail Price', retail_price)}
					</TabPane>					
				</TabContent>		
		</div>);
	}
		
	stock_field(){
		
		var stock_array = ['Stocked in Stores', 'Quick Ship'];
		var ret_html = '';
		var state_stock = this.state.selected.stock;
		var handleChange = this.handleChange;
		ret_html = stock_array.map(function(field, key) {
			var field_id = field.replace(/\s/g, "");
			return(
				<FormGroup check className="checkbox" key={key}>
					<Input className="form-check-input" id={field_id} type="radio" name="stock" value={field} onChange={handleChange} title={field}  />
					<Label check className="form-check-label" for={field_id} >{field}</Label>
				</FormGroup>
			);
		})

		return(
			<FormGroup row>
				<Col md="3"><Label className="lable_title">Program</Label></Col>
				<Col md="9">
				{ret_html}
				</Col>
			</FormGroup>
		);
	}
	
	get_unique_values_from_array_object(array,field){
		var tmp_arr = [];
		Object.keys(array).map(function(key) {
			tmp_arr[array[key][field]] = array[key];
		})
		return tmp_arr;
	} 
	
	filter_list(field, distinct, objlist){
		const dropdown = [];
		var get_product_selector = objlist;
		if(distinct === true){
			get_product_selector = this.get_unique_values_from_array_object(objlist, field);
		}
		Object.keys(get_product_selector).map(function(key) {
			var arr ={};
			if(distinct === true){
				arr = { value: key, label: key };
			}else{
				var val = get_product_selector[key];
				if(val[field] != "") {
					var arr = { value: val[field], label: val[field] };
					if(field === 'dimention'){
						var set_label = val['w']+'X'+val['d'];
						if(val['w'] === ''){
							set_label = '-X'+val['d'];
						}
						arr = { value:key , label: set_label };
					}	
				}	
			}
			return dropdown.push(arr);
		})
		return dropdown.sort((a, b) => (a.value > b.value) ? 1 : -1);
	}
	
    dropdown_select(select_options, name, title){
		return(
			<FormGroup row>
				<Col md="3">
				  <Label htmlFor="text-input" className="lable_title"> {title}</Label>
				</Col>
				
				<Col xs="12" md="9">
					<Select onChange={this.handleChangeSelect.bind(this, name)}
						name={name}
						value={this.state.selected_arr[name]}
						options={select_options}
						formatGroupLabel={formatGroupLabel}
					/>
				</Col>
			</FormGroup>		
		);
	}
	check_condition(field){
	
		if(field === 'bowl_style'){
			var tmp = {};
			var tmp_state = 'filter_'+field;
			var selected_value = this.state.selected[field];
			Object.keys(this.state[tmp_state]).map(function(key){
				if(product_selector[key][field] === selected_value){
					return tmp[key] =  product_selector[key];
				}
			})
			this.setState({'filter_width_depth':tmp});
			
		}
		
		if(field === 'finish'){
			var tmp = {};
			var tmp_state = 'filter_'+field;
			var selected_value = this.state.selected[field];
			Object.keys(this.state[tmp_state]).map(function(key){
				if(product_selector[key][field] === selected_value){
					return tmp[key] =  product_selector[key];
				}
			})
			this.setState({'filter_bowl_style':tmp});			
		}

		if(field === 'stock'){
			var tmp = {};
			var tmp_state = 'filter_'+field;
 			var selected_value = this.state.selected[field];
			Object.keys(product_selector).map(function(key){
				if(product_selector[key][field] === selected_value){
					return tmp[key] =  product_selector[key];
				}
			})
			this.setState({'filter_finish':tmp});
		}	

		
	}	

	render_pdf_row(pdf_filepath, title){
		pdf_filepath = "../../product_selector/pdf/"+pdf_filepath;
		return(
			<span className="pdfrow"> 
				<a href={pdf_filepath} target="_blank" className="left">
					<i className="fa fa-file-pdf-o pdficon"></i>
					{title} 
				</a>	
				<a href={pdf_filepath} className="right" target="_blank" download><i className="fa fa-download pdf_download"></i></a>
				
			</span>			
		);
	}
	product_image_pdf(){
		
		var product_image = '';
		var product_image_2 = '';
		var product_pdf = '';
		if(product_selector[this.state.selected.dimention] !== undefined){
			var product_id = product_selector[this.state.selected.dimention];
			product_image = "../../product_selector/images/"+product_id['image_id']+"_mi1_mw.jpg";
			product_image_2 = "../../product_selector/images/"+product_id['image_id']+"_scene_mw.jpg";
			product_pdf = product_id['image_id']+"_ts_mw.pdf";
		}
		
		return(
			<Row style={product_image === '' ? { display: 'none' } : {} }>
				<Col xs="12" lg="12">
					<span className="col33">
						<a href={product_image} className="product_download" target="_blank" download><i className="fa fa-download"></i></a>
						<a href={product_image} target="_blank" className="left"><img className="fw" src={product_image} /></a>
					</span>
					
					<span className="col33">
						<a href={product_image_2} className="product_download" target="_blank" download><i className="fa fa-download"></i></a>
						<a href={product_image_2} target="_blank" className="left"><img className="fw" src={product_image_2} /></a>
					</span>
				
					<div className="col33 third">
					{this.render_pdf_row(product_pdf, 'Technical Specifications')}
					{this.render_pdf_row('VT_new_im_mw.pdf', 'Installation ')}
					{this.render_pdf_row('VT_new_ucm_mw.pdf', 'Care & Maintenance')}
					{this.render_pdf_row('VT_new_warranty_mw.pdf', 'Warranty ')}
					</div>
				</Col>
			</Row>
		);
	}
	
	getprice_from_sku(){
		var sku_dropdown = [];
		Object.keys(product_selector).map(function(key) {
			var val = product_selector[key];
			var arr = { value: val['sku'], label: val['sku'] };	
			return sku_dropdown.push(arr);
			//arr = { value: val['image_id'], label: val['image_id'] };
			//return sku_dropdown.push(arr);
		})

		//const sku_dropdown = this.filter_list('sku', true, this.state.filter_sku);
		return(
			<Col xs="8" lg="8" className="search_sku_sec" style={this.state.quote_submit === true ? { display: 'none' } : {display: 'block' } }>
			<Row className="row_first">
				<Col xs="8" lg="8">{this.dropdown_select(sku_dropdown, 'search_sku', 'Search by SKU')}</Col>
				<Col xs="2" lg="2"><Button type="submit" size="sm" color="primary" onClick={this.handleSubmitSku.bind(this)}><i className="fa fa-dot-circle-o"></i> Submit</Button></Col>
			</Row>
			<Row><p className="text-ok">OR</p></Row>
			</Col>
		);
	}
	
/*spo_compare*/
	toggle_comparission(){
		this.setState({addClass_SPO: !this.state.addClass_SPO});
	}
	
	render_matched_spo(){
		this.check_ifexisting_spo(mvtJson);
		if(this.show_spo === false){
			return(
				<div><Alert color="danger">Your are selected value not matched in SPO!</Alert></div>		
			);
		}else{
			return this.PriceTab_SPO();
		}
	}
	
	field_row_list_SPO(title,field, price){			
		return(
			<ListGroupItem className='fill'><span>{title}: </span>{field} - <i className="fa fa-dollar"></i>{price.toFixed(2)}</ListGroupItem>
		);
	}
	
	RenderPricearea_SPO(individual_price, total_price, title){
		let dim = this.state.selected.dimention;
		return(
		<Card>
		<CardHeader className="text-center total_price_main">
			<span className="strip">SPO</span>
			<span style={{'fontSize':'20px'}}>Estimated {title} Price: </span> <i className="fa fa-dollar"></i> <span className="total_price">{total_price.toFixed(2)}</span>
		</CardHeader>							
		<CardBody className="pricearea">
			<Row>
				<Col md='12'>					
					<ListGroup>
					{this.field_row_list_SPO('Finish Colors',product_selector[dim]['finish'], individual_price.matte_finish)}
					{this.field_row_list_SPO('Vanity Size (W X D)',product_selector[dim]['others']['dim'], individual_price.bowl_style)}
					{this.field_row_list_SPO('Bowl Finish',product_selector[dim]['others']['bowl_finish'], individual_price.biscuit)}
					{this.field_row_list_SPO('Bowl Location',product_selector[dim]['others']['bowl_location'], individual_price.bowl_location)}
					{this.field_row_list_SPO('Faucet Center',product_selector[dim]['others']['faucet_centre'], individual_price.faucet_center)}
					{this.field_row_list_SPO('Backsplash',product_selector[dim]['others']['backsplash'], individual_price.backsplash)}
					{this.field_row_list_SPO('Overflow',product_selector[dim]['others']['overflow'], individual_price.overflow)}
					{this.field_row_list_SPO('Side Splash','', individual_price.side_splash)}					
					</ListGroup>				
				</Col>
			</Row>
		</CardBody>
		</Card>
		);	
	}


	check_ifexisting_spo(pricejson){
		let dim = product_selector[this.state.selected.dimention]['others']['dim'];
		let bowl_location = product_selector[this.state.selected.dimention]['others']['bowl_location'];
		
		if(bowl_location == 'Single Centered'){
			bowl_location = '-SB';
		}else if(bowl_location == 'Double-bowl'){
			bowl_location = '-DB'
		}else{
			bowl_location = '';
		}
		let err = '';let get_spoprice = '';
		this.show_spo = true;
		if((pricejson[dim]) !== undefined){
			get_spoprice = dim;
		}else if((pricejson[dim+bowl_location]) !== undefined){
			get_spoprice = dim+bowl_location;
		}else if((pricejson[dim+'-SB']) !== undefined){
			err ='SB';
			get_spoprice = dim+'-SB';
		}else if((pricejson[dim+'-DB']) !== undefined){
			err ='DB';
			get_spoprice = dim+'-DB';
		}else if((pricejson[dim+'-ST']) !== undefined){
			err ='ST';
			get_spoprice = dim+'-ST';
		}else{
			console.log('Something Error!');
			err ='erro';
			this.show_spo = false;
		}
		this.selected_spo = get_spoprice;
		console.log(get_spoprice);		
	}
	
	GetPrice(pricejson, individual_price){
		
		let get_type = three_type[product_selector[this.state.selected.dimention]['finish']];
		let get_bowlstyle = this.getKeyByValue(key_title, product_selector[this.state.selected.dimention]['others']['bowl_style']);
		let get_spoprice = pricejson[this.selected_spo];
		
		let total_price = 0;
		individual_price['matte_finish'] = parseFloat(get_spoprice.matte_finish);
		individual_price['biscuit'] = parseFloat(get_spoprice.biscuit);
		individual_price['bowl_location'] = parseFloat(get_spoprice.offset_bowl);
		individual_price['faucet_center'] = parseFloat(get_spoprice.faucet);
		if(get_type === 'basic'){
			individual_price['backsplash'] = parseFloat(get_spoprice.backsplash_basic);
		}else{
			individual_price['backsplash'] = parseFloat(get_spoprice.backsplash_standard_premium);
		}
		
		individual_price['bowl_style'] = parseFloat(get_spoprice[get_bowlstyle][get_type]);
		
		individual_price['overflow'] = parseFloat(get_spoprice.no_overflow);
		individual_price['side_splash'] = 0;
		total_price += individual_price['matte_finish'];
		total_price += individual_price['biscuit'];
		total_price += individual_price['bowl_location'];
		total_price += individual_price['faucet_center'];
		total_price += individual_price['backsplash'];
		total_price += individual_price['bowl_style'];
		total_price += individual_price['overflow'];
		total_price += individual_price['side_splash'];
		console.log(individual_price);
		return total_price;
	}
	
	PriceTab_SPO(){
		
		this.total_price_SPO['ppdPrice'] = this.GetPrice(ppdJson, this.individual_ppd);
		this.total_price_SPO['mvtPrice'] = this.GetPrice(mvtJson, this.individual_mvt);
		this.total_price_SPO['retailPrice'] = this.GetPrice(retailJson, this.individual_retail);
		
		return(<div>
				<Nav tabs>
				  <NavItem>
					<NavLink
					  active={this.state.activeTab[0] === '2'}
					  onClick={() => { this.toggle_tab(0, '2'); }}
					>
					  PPD Price
					</NavLink>
				  </NavItem>
				  <NavItem>
					<NavLink
					  active={this.state.activeTab[0] === '3'}
					  onClick={() => { this.toggle_tab(0, '3'); }}
					>
					  Retail Price
					</NavLink>
				  </NavItem>				  
				</Nav>
				<TabContent activeTab={this.state.activeTab[0]} className="listing">
					<TabPane tabId="1">
						{this.RenderPricearea_SPO(this.individual_mvt, this.total_price_SPO['mvtPrice'], 'MVT')}					
					</TabPane>				
					<TabPane tabId="2">
						{this.RenderPricearea_SPO(this.individual_ppd, this.total_price_SPO['ppdPrice'], 'PPD')}							
					</TabPane>
					<TabPane tabId="3">
						{this.RenderPricearea_SPO(this.individual_retail, this.total_price_SPO['retailPrice'], 'Retail')}							
					</TabPane>					
				</TabContent>		
		</div>);
	}	
	getKeyByValue(object, value) {
		return Object.keys(object).find(key => object[key] === value);
	}	
/*spo_compare*/	
	
  render() { 

  console.log(this.individual_ppd);
  console.log(this.individual_mvt);
   
    if(this.state.user.user_type != "SP"){
      return (<Redirect to={'/customers'}/>)
    }
	const width_depth_dropdown = this.filter_list('dimention', false, this.state.filter_width_depth);
	const description_dropdown = this.filter_list('description', false, product_selector);
	const bowl_style_dropdown = this.filter_list('bowl_style', true, this.state.filter_bowl_style);
	const finish_dropdown = this.filter_list('finish', true, this.state.filter_finish);	

    return (
      <div className="react_table animated fadeIn product_selector">
	  {this.getprice_from_sku()}
      <Row>
	  
        <Col xs="8" lg="8" style={this.state.quote_submit === true ? { display: 'none' } : {display: 'block' } }>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Product Selector Form <Button type="submit" size="sm" color="primary" style={{'float':'right'}} onClick={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
            </CardHeader>
            <CardBody>

        <Form method="post" encType="multipart/form-data" className="form-horizontal spo_quote_from" onSubmit={this.handleSubmit}>

			{this.stock_field()}
			{this.dropdown_select(finish_dropdown, 'finish', 'Finish')}		
			{this.dropdown_select(bowl_style_dropdown, 'bowl_style', 'Bowl Style')}
			{this.dropdown_select(width_depth_dropdown, 'dimention', 'Dimension (W X D)')}
			
            <Button type="submit" size="sm" color="primary" style={{'float':'right', 'marginTop':'15px'}}><i className="fa fa-dot-circle-o"></i> Submit</Button>
        </Form>			
			
            </CardBody>
          </Card>
        </Col>
		
		<Col lg={this.state.addClass_SPO === false ?  "8"  : "4"  } className={this.state.addClass_SPO === false ?  "two_col"  : "three_col"  } style={this.state.quote_submit === true ? { display: 'block' } : {display: 'none' } }>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Product view and download 
            </CardHeader>
            <CardBody>		
			{this.product_image_pdf()}
            </CardBody>
          </Card>			
		</Col>
		
		<Col lg={this.state.addClass_SPO === false ?  "4"  : "8"  } id={this.state.quote_submit === true ? "price_right_submited_" : "one" } className={this.state.addClass_SPO === false ?  "price_display_fixed"  : "price_display_fixed spo_price_result ps_div"  } >
				<div className="after_submit" style={this.state.quote_submit === true ? { display: 'block' } : {display: 'none' } }>
					<Button size="sm" color="primary" onClick={this.handleChangeAfterSubmit.bind(this, 'edit')} ><i className="fa fa-undo"></i> Back</Button>
					<NavLink href="/productselector"><Button size="sm" color="primary" ><i className="fa fa-plus"></i> Add New</Button></NavLink>
					<Button size="sm" color="primary" onClick={this.toggle_comparission.bind(this)}>Compare To SPO</Button>
				</div>			
			   <div className="right">{this.PriceTab()}</div>
				
				{(this.state.quote_submit !== false) ? 
				<div className="left" style={this.state.addClass_SPO === false ? { display: 'none' } : {display: 'block' } } >{this.render_matched_spo()}</div>:<div>-</div>}
		</Col>
      </Row>
	 	 
	  
      </div>
    );
  }
}

export default Manage;
