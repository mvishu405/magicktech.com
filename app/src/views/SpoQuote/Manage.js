import React, { Component } from 'react';
import { NavLink, Button, Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, TabContent, TabPane, NavItem, Nav, Alert} from 'reactstrap';
import Select from 'react-select'
import {Redirect} from 'react-router-dom';
//import {Link} from 'react-router-dom';
import ppdJson from './price_master_ppd.json';
import mvtJson from './price_master_mvt.json';
import retailJson from './price_master_retail.json';
import product_selector from '../ProductSelector/product_selector.json';
import $ from 'jquery';

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
"1":"Universal side splash(4) 1",
"2":"Universal side splash(4) 2",
"no_side_splash":"No side splash"
};


const BasicColors = [
	{ value: 'Solid White', label: 'Solid White', color: '#00B8D9', type:'basic'},
	{ value: 'White Swirl', label: 'White Swirl', color: '#0052CC', type:'basic'},
	{ value: 'Italian White', label: 'Italian White', color: '#5243AA', type:'basic' },
	{ value: 'Solid Bone', label: 'Solid Bone', color: '#FF5630', type:'basic'},
	{ value: 'White Bone', label: 'White Bone', color: '#FF8B00', type:'basic' },
	{ value: 'Black/White Swir', label: 'Black/White Swir', color: '#FFC400', type:'basic' }
];

const StandardColors = [
	{ value: 'Pewter', label: 'Pewter', type:'standard'},
	{ value: 'Moonstone', label: 'Moonstone', type:'standard'},
	{ value: 'Dune', label: 'Dune', type:'standard'},
	{ value: 'Cappuccino', label: 'Cappuccino', type:'standard'},
	{ value: 'Pebble Beach', label: 'Pebble Beach', type:'standard'},
	{ value: 'Galaxy Black', label: 'Galaxy Black', type:'standard'},
	{ value: 'Midnight Black Matte', label: 'Midnight Black Matte', type:'standard'},
];

const PremiumColors = [
	{ value: 'Sandy Coast', label: 'Sandy Coast', type:'premium'},
	{ value: 'Gray mist ', label: 'Gray mist', type:'premium'},
	{ value: 'Carrara', label: 'Carrara', type:'premium'},
	{ value: 'Snow Drift', label: 'Snow Drift', type:'premium'},
	{ value: 'Arctic Stone', label: 'Arctic Stone', type:'premium'},
	{ value: 'Cashmere', label: 'Cashmere', type:'premium'},
	{ value: 'Frost', label: 'Frost', type:'premium'},
	{ value: 'Speckled Taupe', label: 'Speckled Taupe', type:'premium'},
	{ value: 'Beige Quartz', label: 'Beige Quartz', type:'premium'},
	{ value: 'Bahama Sand', label: 'Bahama Sand', type:'premium'},
	{ value: 'Almond', label: 'Almond', type:'premium'},
	{ value: 'Sand', label: 'Sand', type:'premium'},
	{ value: 'Caramel Corn', label: 'Caramel Corn', type:'premium'},
	{ value: 'Rocky Trail', label: 'Rocky Trail', type:'premium'},
	{ value: 'Aggregate', label: 'Aggregate', type:'premium'},
];	  

const FinishOptions = [
	{
		label: 'Basic Colors',
		options: BasicColors,
	},
	{
		label: 'Standard Colors',
		options: StandardColors,
	},
	{
		label: 'Premium Colors',
		options: PremiumColors,
	}  
];

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

class Manage extends Component {
	constructor(props) {
		super(props);
		
		this.matte_finish_val=false;
		this.bowl_style_val=false;
		this.bowl_size_val=false;
		this.bowl_location_val=false;
		this.bowl_backsplash_val=false;
		
		this.alert_msg = '';
		this.show_ps = false;
		this.state = {
			data: [],			
			finish_selected_options: [],
			user: JSON.parse(localStorage.getItem('userData')),
			selected:{},
			selected_opt:[],
			selected_val:[],
			quote_submit:false,
			selected_ps:{
			  'bowl_style':"",
			  'dimention':0,
			  'finish':"",
			  'stock':""
			},			
			activeTab: new Array(3).fill('2'),
			addClass_PS: false
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
		
		this.total_price=[];		
		this.total_price['ppdPrice']=0;		
		this.total_price['mvtPrice']=0;		
		this.total_price['retailPrice']=0;		
		
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
	}
	handleChangeSelect(key, e) {
		const selected = this.state.selected;
		selected[key] = e.value;
		if(e.type){
			selected['type'] = e.type;
		}
		this.setState({selected});
		this.check_condition(key);
	}

	GetPrice(pricejson, individual_price){
		let total_price = 0; 
		individual_price['matte_finish'] = 0;
		individual_price['biscuit'] = 0;
		individual_price['bowl_location'] = 0;
		individual_price['faucet_center'] = 0;
		individual_price['backsplash'] = 0;
		individual_price['overflow'] = 0;
		individual_price['side_splash'] = 0;
		let selected_value = this.state.selected;
		if(selected_value.bowl_size !== undefined ){
			var get_row = pricejson[selected_value.bowl_size];
			var get_sidesplash = pricejson['side_splash'];
				if(selected_value['bowl_style'] !== undefined){
					total_price = parseFloat(get_row[selected_value['bowl_style']][selected_value['type']]);
					individual_price['bowl_style'] = total_price;
					if(selected_value['matte_finish'] === 'matte_finish'){
						total_price += parseFloat(get_row[selected_value['matte_finish']]);
						individual_price['matte_finish'] = parseFloat(get_row[selected_value['matte_finish']]);
					}
					if(selected_value['biscuit'] === 'biscuit'){
						total_price += parseFloat(get_row[selected_value['biscuit']]);
						individual_price['biscuit'] = parseFloat(get_row[selected_value['biscuit']]);
					}
					 if(selected_value['bowl_location'] === 'offset_bowl_left' || selected_value['bowl_location'] === 'offset_bowl_right'){
						total_price += parseFloat(get_row['offset_bowl']);
						individual_price['bowl_location'] = parseFloat(get_row['offset_bowl']);
					} 

					if(selected_value['faucet_center'] !== '4'){
						total_price += parseFloat(get_row['faucet']);
						individual_price['faucet_center'] = parseFloat(get_row['faucet']);
					} 					
					
					 if((selected_value['backsplash'] !== undefined) && (selected_value['backsplash'] === 'backsplash')){
						if(selected_value['type'] === 'basic'){
							total_price += parseFloat(get_row['backsplash_basic']);
							individual_price['backsplash'] = parseFloat(get_row['backsplash_basic']);
						}else{
							total_price += parseFloat(get_row['backsplash_standard_premium']);
							individual_price['backsplash'] = parseFloat(get_row['backsplash_standard_premium']);
						} 
					}
					if(selected_value['overflow'] === 'no_overflow'){
						total_price += parseFloat(get_row['no_overflow']);
						individual_price['overflow'] = parseFloat(get_row['no_overflow']);
					}
					if((selected_value['side_splash'] !== undefined) && (selected_value['side_splash'] !== 'no_side_splash')){
						
							let side_splash_price = parseFloat(get_sidesplash[selected_value['bowl_style']][selected_value['type']]);
						    if(selected_value['side_splash'] == '2'){
								side_splash_price = side_splash_price * parseFloat(selected_value['side_splash']);
							}
							if(selected_value['side_splash'] == 'uss_2'){
								side_splash_price = side_splash_price * 2;
							}
							if(selected_value['side_splash'] == 'uss_1'){
								side_splash_price = side_splash_price * 1;
							}							
							
							if(selected_value['matte_finish'] === 'matte_finish'){
								side_splash_price = side_splash_price + parseFloat(get_sidesplash['matte_finish']);
							}
							total_price += parseFloat(side_splash_price);
							individual_price['side_splash'] = parseFloat(side_splash_price);
					}
				}
		}
		return total_price;
	}
		
	handleSubmit(e) {
		e.preventDefault();	
		
		if(this.state.selected.bowl_size !== undefined && this.state.selected.bowl_style !== undefined && this.state.selected.faucet_center !== undefined && this.state.selected.side_splash !== undefined && this.state.selected.overflow !== undefined && this.state.selected.matte_finish !== undefined){
			this.setState({quote_submit:true});
			this.compare_toproductselector();
		}else{
			alert('All field are required!');
		}
	}
	handleChangeAfterSubmit(type, e) {
		this.setState({quote_submit:false});
	}
 	disable_input_uncheck(name){
		let selected = this.state.selected;
		let selected_val = this.state.selected_val;
			$("input:radio[name="+name+"]").prop('checked', false);
			selected[name] = undefined;
			this.setState({selected});
		this.setState({selected_val});		
	} 
	condition_location(tmp, input){
		let selected_val = this.state.selected_val;
		
		if(tmp.indexOf(input) === 6 && input === 'DB'){
			selected_val['bowl_location_DB'] = false;
			selected_val['bowl_location_SB'] = true;
			selected_val['bowl_location_OL'] = true;
			selected_val['bowl_location_OR'] = true;
		}else if(input === 'ONLYDB_H'){
			selected_val['bowl_location_DB'] = true;
			selected_val['bowl_location_SB'] = false;
			selected_val['bowl_location_OL'] = false;
			selected_val['bowl_location_OR'] = false;			
		}else{
			selected_val['bowl_location_DB'] = true;
			selected_val['bowl_location_SB'] = false;
			selected_val['bowl_location_OL'] = true;
			selected_val['bowl_location_OR'] = true;			
		}
		return selected_val;
	}
	common_notavailable(selected, match, condition){
		if(selected === undefined){
			return;
		}
		const selected_val = this.state.selected_val;
		if(match){
			selected_val[condition] = true;
		}else{
			selected_val[condition] = false;
		}		
	}
	condition_sizeandstyle(only_ovalrecessed_wave, ){
		if(this.state.selected.bowl_size !== undefined && this.state.selected.bowl_size !== undefined){
			if($.inArray( this.state.selected.bowl_size, only_ovalrecessed_wave ) !== -1 && (this.state.selected.bowl_style === 'wave' || this.state.selected.bowl_style === 'oval_recessed')){
				this.condition_location(this.state.selected.bowl_size, 'ONLYDB_H');
			}else{
				this.condition_location(this.state.selected.bowl_size, 'DB');
			}				
		}
		
	}
	check_condition(name){

		const selected_val = this.state.selected_val;
		let only_ovalrecessed_wave = ["37x22", "43x22", "49x22", "61x22-SB", "73x22-SB"];
		let slabtop_na = ["19x17", "61x19-SB", "61x19-DB", "61x22-SB", "61x22-DB"];
		//let oval_nr_na = ["19x17"];
		let oval_nr_na = ["61x19-SB", "61x19-DB", "61x22-SB", "61x22-DB", "73x22-ST", "61x19-ST"];
		let oval_r_na = ["19x17", "73x22-ST", "61x19-ST"];
		let wave_na = ["19x17", "73x22-SB", "73x22-ST", "61x19-ST"];
		let contemporary_na = ["19x17", "73x22-SB", "73x22-ST", "61x19-ST"];
		let luna_na = ["19x17", "73x22-SB", "73x22-ST", "61x19-ST"];
		let ru_na = ["19x17", "73x22-SB", "73x22-ST", "61x19-ST"];
		let ou_na = ["19x17", "73x22-SB", "73x22-ST", "61x19-ST"];
		let leftside_35 = ["oval_non_recessed", "oval_recessed"];
		let rightside_35 = ["oval_non_recessed", "oval_recessed"];
		let universalside_35 = ["wave", "luna"];
		let leftside_4 = ["oval_recessed"];
		let rightside_4 = ["oval_recessed"];
		let universalside_4 = ["slab_top", "contemporary", "rectangle_undermount", "oval_undermount"];
		let showbowloption = ["wave", "oval_recessed"];
		
		if(name === 'finish_options'){
			selected_val['matte_finish_val'] = this.state.selected.finish_options === 'Midnight Black Matte';
			this.disable_input_uncheck('matte_finish');
		}else if(name === 'bowl_style'){
			selected_val['bowl_backsplash_val'] = this.state.selected.bowl_style === 'oval_non_recessed' || this.state.selected.bowl_style === 'oval_recessed' || this.state.selected.bowl_style === 'luna' || this.state.selected.bowl_style === 'wave' && this.state.selected.bowl_style !== undefined;
						
			this.common_notavailable(this.state.selected.bowl_style, this.state.selected.bowl_style ==='slab_top', 'finish_location_hide');
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, showbowloption) === -1, 'bowl_location_hide');
			this.common_notavailable(this.state.selected.bowl_style, this.state.selected.bowl_style ==='slab_top', 'overflow_na');
			
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, leftside_35) === -1, 'leftside_35');
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, rightside_35) === -1, 'rightside_35');
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, leftside_4) === -1, 'leftside_4');
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, rightside_4) === -1, 'rightside_4');
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, universalside_35) === -1, 'universalside_35');
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, universalside_4) === -1, 'universalside_4');
			this.common_notavailable(this.state.selected.bowl_style, $.inArray( this.state.selected.bowl_style, universalside_4) === -1, 'backsplash_hide');
			this.condition_sizeandstyle(only_ovalrecessed_wave);
			this.disable_input_uncheck('biscuit');
			this.disable_input_uncheck('bowl_location');
			this.disable_input_uncheck('faucet_center');
			this.disable_input_uncheck('backsplash');
			this.disable_input_uncheck('overflow');
			this.disable_input_uncheck('side_splash');
		}else if(name === 'bowl_size' && this.state.selected.bowl_size !== undefined){
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, slabtop_na) !== -1, 'slabtop_na');
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, oval_nr_na ) !== -1, 'oval_nr_na');
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, oval_r_na ) !== -1, 'oval_r_na');
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, wave_na ) !== -1, 'wave_na');
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, contemporary_na ) !== -1, 'contemporary_na');
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, luna_na ) !== -1, 'luna_na');
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, ru_na ) !== -1, 'ru_na');
			this.common_notavailable(this.state.selected.bowl_size, $.inArray( this.state.selected.bowl_size, ou_na ) !== -1, 'ou_na');
			
			this.condition_location(this.state.selected.bowl_size, 'DB');
			this.disable_input_uncheck('bowl_style');
			this.disable_input_uncheck('biscuit');
			this.disable_input_uncheck('bowl_location');
			this.disable_input_uncheck('faucet_center');
			this.disable_input_uncheck('backsplash');
			this.disable_input_uncheck('overflow');
			this.disable_input_uncheck('side_splash');
			this.condition_sizeandstyle(only_ovalrecessed_wave);
		}else{

		}
		
		this.setState({selected_val});
	}

	RenderPricearea(individual_price, total_price, title){
		const condition = this.state.selected_val;
		let vanity_size = '';
		if(this.state.selected.bowl_size !== undefined){
			vanity_size = (this.state.selected.bowl_size).replace(/x/g, " X ");
		}
		let backsplash_hide = false;
		if(this.state.selected.backsplash === undefined && condition.backsplash_hide !== true){
			backsplash_hide = true;
		}
		if(this.state.selected.backsplash !== '' && condition.backsplash_hide !== true){
			backsplash_hide = true;
		}		
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
					<ListGroupItem className={this.state.selected.finish_options !== undefined ? "fill":""}><span>Finish Colors: </span>{this.state.selected.finish_options}</ListGroupItem>
					
					<ListGroupItem className={this.state.selected.matte_finish !== undefined ? "fill":""}><span>Matte or Gloss Finish: </span>{$("#"+this.state.selected.matte_finish).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.matte_finish).toFixed(2)}</ListGroupItem>
					
					<ListGroupItem className={this.state.selected.bowl_size !== undefined ? "fill":""}><span>Vanity Size (W X D): </span>
					{vanity_size}</ListGroupItem>

					<ListGroupItem className={this.state.selected.bowl_style !== undefined ? "fill":""}><span>Bowl Style: </span>{$("#"+this.state.selected.bowl_style).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.bowl_style).toFixed(2)}</ListGroupItem>							
					
				
					<ListGroupItem className={this.state.selected.biscuit !== undefined ? "fill":""} style={condition.finish_location_hide === true ? { display: 'none' } : {} }><span>Bowl Finish: </span>{$("#"+this.state.selected.biscuit).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.biscuit).toFixed(2)}</ListGroupItem>
					
					
					{condition.bowl_location_hide !== true ?
					<ListGroupItem className={this.state.selected.bowl_location !== undefined ? "fill":""} style={condition.finish_location_hide === true ? { display: 'none' } : {} }><span>Bowl Location: </span>{$("#"+this.state.selected.bowl_location).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.bowl_location).toFixed(2)}</ListGroupItem>:''
					}
					
												
					<ListGroupItem className={this.state.selected.faucet_center !== undefined ? "fill":""}><span>Faucet Center: </span>{$(".faucet_center #"+this.state.selected.faucet_center).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.faucet_center).toFixed(2)}</ListGroupItem>
					
					{backsplash_hide === true ?
					<ListGroupItem className={this.state.selected.backsplash !== undefined ? "fill":""}><span>Backsplash: </span>{$("#"+this.state.selected.backsplash).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.backsplash).toFixed(2)}</ListGroupItem>:''}
					
					<ListGroupItem className={this.state.selected.overflow !== undefined ? "fill":""}><span>Overflow: </span>{$("#"+this.state.selected.overflow).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.overflow).toFixed(2)}</ListGroupItem>
					
					<ListGroupItem className={this.state.selected.side_splash !== undefined ? "fill":""}><span>Side Splash: </span>{$(".side_splash #"+this.state.selected.side_splash).attr('title')} - <i className="fa fa-dollar"></i> {(individual_price.side_splash).toFixed(2)}</ListGroupItem>
					
					</ListGroup>				
				</Col>
			</Row>
		</CardBody>
		</Card>
		);	
	}
	PriceTab(){
		this.total_price['ppdPrice'] = this.GetPrice(ppdJson, this.individual_ppd);
		this.total_price['mvtPrice'] = this.GetPrice(mvtJson, this.individual_mvt);
		this.total_price['retailPrice'] = this.GetPrice(retailJson, this.individual_retail);			
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
						{this.RenderPricearea(this.individual_ppd, this.total_price['ppdPrice'], 'PPD')}							
					</TabPane>
					<TabPane tabId="3">
						{this.RenderPricearea(this.individual_retail, this.total_price['retailPrice'], 'Retail')}							
					</TabPane>					
				</TabContent>		
		</div>);
	}



/*product Selector*/
	compare_toproductselector(){
		var tmp = this.state.selected;
		var ps_key = [];
		ps_key['finish'] = '';ps_key['key'] = '';ps_key['bowl_style'] = '';
		Object.keys(product_selector).map(function(key) {
			var val = product_selector[key];
			if(val['others']['dim'] === tmp['bowl_size'] && val['others']['bowl_style'] === key_title[tmp['bowl_style']] && val['others']['overflow'] === key_title[tmp['overflow']] && val['finish'] === tmp['finish_options']			
			){
				ps_key['key'] = key;
				ps_key['stock'] = val['stock'];
				ps_key['finish'] = val['finish'];
				ps_key['bowl_style'] = val['bowl_style'];
			}
			
		})
		if(ps_key['key'] != ''){
			const selected_ps = this.state.selected_ps;
			selected_ps['stock'] = ps_key['stock'];
			selected_ps['finish'] = ps_key['finish'];
			selected_ps['dimention'] = ps_key['key'];
			selected_ps['bowl_style'] = ps_key['bowl_style'];
			this.setState({selected_ps}); 
			this.get_total_price();
			this.show_ps = true;
		}else{
			this.show_ps = false;
			console.log('does not match dimention field in product_selector');
		}
	}


	toggle_comparission(){
		this.setState({addClass_PS: !this.state.addClass_PS});
	}
	
	render_otmatched_ps(){
		if(this.show_ps === false){
			console.log(this.show_ps);
			return(
				<div><Alert color="danger">Your are selected value not matched in product selector!</Alert></div>		
			);
		}else{
			return this.PriceTab_PS();
		}
	}
	field_row_list(field, name){
		var dimention = '';
		var selected_value = this.state.selected_ps[field];
		if(product_selector[this.state.selected_ps.dimention] !== undefined && field === 'dimention'){
			dimention = product_selector[this.state.selected_ps.dimention];
			selected_value = dimention.w+'X'+dimention.d;
		}			
			
		return(
			<ListGroupItem className='fill'><span>{name}: </span>{selected_value}</ListGroupItem>
		);
	}
	RenderPricearea_ps(price_type, title, total_price){
				
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
		var total = product_selector[this.state.selected_ps.dimention];
		this.setState({ppt_price_ps:total.ppt_price, retail_price_ps:total.retail_price, mvt_price_ps:total.mvt_price});
	}
	
	PriceTab_PS(){
		
		var ppt_price = this.state.ppt_price_ps;
		var retail_price = this.state.retail_price_ps;
		var mvt_price = this.state.mvt_price_ps;
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
						{this.RenderPricearea_ps('ppd_price', 'PPD Price', ppt_price)}
					</TabPane>
					<TabPane tabId="3">
						{this.RenderPricearea_ps('retail_price', 'Retail Price', retail_price)}
					</TabPane>					
				</TabContent>		
		</div>);
	}
/*product Selector*/
	

  render() { 
    if(this.state.user.user_type != "SP"){
      return (<Redirect to={'/customers'}/>)
    }
	const condition = this.state.selected_val;
	const BowlSizeOptions =[];
	Object.keys(ppdJson).map(function(key) {
		var arr = { value: key, label: key.replace(/x/g, " X ") };
		return BowlSizeOptions.push(arr);
	})
	if(condition.bowl_location_hide == true){
		$("#show_bowl_loc").hide();
		if(this.state.selected.biscuit !== undefined){
			$("#faucet_center_row").removeClass('hide');
		}
	}else{
		$("#show_bowl_loc").show();
	}
	let overflow_hide = "";
	if(this.state.selected.backsplash === undefined && condition.backsplash_hide !== true){
		overflow_hide = "hide";
		
	}else if(this.state.selected.faucet_center === undefined ){
		overflow_hide = "hide";
	}else{}	
	
    return (
      <div className="react_table animated fadeIn">
      <Row>
	  
        <Col xs="8" lg="8" style={this.state.quote_submit === true ? { display: 'none' } : {display: 'block' } }>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> SPO Quote Form <Button type="submit" size="sm" color="primary" style={{'float':'right'}} onClick={this.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
            </CardHeader>
            <CardBody>

        <Form method="post" encType="multipart/form-data" className="form-horizontal spo_quote_from" onSubmit={this.handleSubmit}>


          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input" className="lable_title">Finish Colors</Label>
            </Col>
            <Col xs="12" md="9">
				<Select onChange={this.handleChangeSelect.bind(this, 'finish_options')}
				    name='finish_options'
					options={FinishOptions}
					formatGroupLabel={formatGroupLabel}
				/>
            </Col>
			</FormGroup>
			
			<FormGroup row className={(this.state.selected.finish_options === undefined) ? 'hide':''}>
				<Col md="3"><Label className="lable_title">Matte or Gloss Finish</Label></Col>
				<Col md="9">
					<FormGroup check className="checkbox" md="6">
					<Input className="form-check-input" id="matte_finish" type="radio" name="matte_finish" value="matte_finish" title="Matte finish" onChange={this.handleChange}  />
					<Label check className="form-check-label" for="matte_finish">Matte finish</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox" md="6">
					<Input className="form-check-input" id="gloss_finish" type="radio" name="matte_finish" value="gloss_finish" title="Gloss finish" onChange={this.handleChange} disabled={condition.matte_finish_val}/>
					<Label check className="form-check-label" for="gloss_finish">Gloss finish</Label>
					</FormGroup>
				</Col>
			</FormGroup>

          <FormGroup row className={(this.state.selected.matte_finish === undefined) ? 'hide':''}>
            <Col md="3">
              <Label htmlFor="text-input" className="lable_title">Vanity Size (W X D)</Label>
            </Col>
            <Col xs="12" md="9">
				<Select onChange={this.handleChangeSelect.bind(this, 'bowl_size')}
					options={BowlSizeOptions}
					formatGroupLabel={formatGroupLabel}
				/>
            </Col>
			</FormGroup>			

			<FormGroup row className={(this.state.selected.bowl_size === undefined) ? 'hide':''} >
				<Col md="3">
				  <Label className="lable_title">Bowl Style</Label>
				</Col>
				<Col xs="9" md="9" className="img_checkbox">
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="oval_non_recessed" type="radio" name="bowl_style" value="oval_non_recessed" title="Oval Non-Recessed" onChange={this.handleChange} 
					 disabled={condition.oval_nr_na} />
					<Label check className="form-check-label" for="oval_non_recessed"><img src={'../../assets/img/non_recessed_oval.png'}  className="img_icon" alt="Oval Non-Recessed" /> Oval Non-Recessed</Label>
					
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="oval_recessed" type="radio" name="bowl_style" value="oval_recessed" title="Oval Recessed" onChange={this.handleChange} disabled={condition.oval_r_na} />
					
					<Label check className="form-check-label" for="oval_recessed"><img src={'../../assets/img/recessed_oval.png'}  className="img_icon" alt="Oval Recessed" /> Oval Recessed</Label>
					
					</FormGroup>
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="oval_undermount" type="radio" name="bowl_style" value="oval_undermount" title="Oval Undermount" onChange={this.handleChange} disabled={condition.ou_na} />
					
					<Label check className="form-check-label" for="oval_undermount"><img src={'../../assets/img/cultured_marble_oval.png'}  className="img_icon" alt="Oval Undermount" /> Oval Undermount</Label>		
					</FormGroup>

					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="rectangle_undermount" type="radio" name="bowl_style" value="rectangle_undermount" title="Rectangle Undermount" onChange={this.handleChange} disabled={condition.ru_na} />
					
					<Label check className="form-check-label" for="rectangle_undermount"><img src={'../../assets/img/cultured_marble_rectangular.png'}  className="img_icon" alt="Rectangle Undermount" /> Rectangle Undermount</Label>
					</FormGroup>					
			
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="luna" type="radio" name="bowl_style" value="luna" title="Luna" onChange={this.handleChange} disabled={condition.luna_na} />
					
					<Label check className="form-check-label" for="luna"><img src={'../../assets/img/luna.png'}  className="img_icon" alt="Luna" /> Luna</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="wave" type="radio" name="bowl_style" value="wave" title="Wave" onChange={this.handleChange}  disabled={condition.wave_na} />
					
					<Label check className="form-check-label" for="wave"><img src={'../../assets/img/wave.png'}  className="img_icon" alt="Wave" /> Wave</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="contemporary" type="radio" name="bowl_style" value="contemporary" title="Contemporary" onChange={this.handleChange} disabled={condition.contemporary_na} />
					
					<Label check className="form-check-label" for="contemporary"><img src={'../../assets/img/regular_contemporary.png'}  className="img_icon" alt="Contemporary" /> Contemporary</Label>
					</FormGroup>
										
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="slab_top" type="radio" name="bowl_style" value="slab_top" title="Slab Top" onChange={this.handleChange} disabled={condition.slabtop_na} />
					
					<Label check className="form-check-label" for="slab_top">
					<img src={'../../assets/img/no_bowl.png'}  className="img_icon" alt="Slab Top" /> Slab Top</Label>
					
					</FormGroup>					
					
				</Col>
			</FormGroup>			
			{(condition.finish_location_hide !== true) ?
			<FormGroup row className={(this.state.selected.bowl_style === undefined) ? 'hide':''}>
				<Col md="3"><Label className="lable_title">Bowl Finish</Label></Col>
				<Col md="9">
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="same_as_top_finish" type="radio" name="biscuit" value="same_as_top_finish" title="Same as top finish" onChange={this.handleChange} />
					<Label check className="form-check-label" for="same_as_top_finish">Same as top finish</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="white" type="radio" name="biscuit" value='white' title="White" onChange={this.handleChange} />
					<Label check className="form-check-label" for="white">White</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="biscuit" type="radio" name="biscuit" value="biscuit" title="Biscuit"onChange={this.handleChange} />
					<Label check className="form-check-label" for="biscuit">Biscuit</Label>
					</FormGroup>					
				</Col>
			</FormGroup>:''}
			{(condition.finish_location_hide !== true) ?
			<FormGroup row id="show_bowl_loc" className={(this.state.selected.biscuit === undefined) ? 'hide':''}>
				<Col md="3"><Label className="lable_title">Bowl Location</Label></Col>
				<Col md="9">
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="single_centered" type="radio" name="bowl_location" value="single_centered" title="Single Centered" onChange={this.handleChange} disabled={condition.bowl_location_SB} />
					<Label check className="form-check-label" for="single_centered">Single Centered</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="double_bowl" type="radio" name="bowl_location" value="double_bowl" title="Double-bowl" onChange={this.handleChange} disabled={condition.bowl_location_DB} />
					<Label check className="form-check-label" for="double_bowl">Double-bowl</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="offset_bowl_left" type="radio" name="bowl_location" value="offset_bowl_left" title="Single Offset (left sink)" onChange={this.handleChange} disabled={condition.bowl_location_OL} />
					<Label check className="form-check-label" for="offset_bowl_left">Single Offset (left sink)</Label>
					</FormGroup>

					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="offset_bowl_right" type="radio" name="bowl_location" value="offset_bowl_right" title="Single Offset (right sink)" onChange={this.handleChange} disabled={condition.bowl_location_OR} />
					<Label check className="form-check-label" for="offset_bowl_right">Single Offset (right sink)</Label>
					</FormGroup>					
				</Col>
			</FormGroup>:''
			}

			<FormGroup row id="faucet_center_row" className={(this.state.selected.bowl_location === undefined) && (condition.finish_location_hide !== true) ? 'hide':''}>
				<Col md="3"><Label className="lable_title">Faucet Center</Label></Col>
				<Col md="9" className="faucet_center">
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="none" type="radio" name="faucet_center" value="none" title="None" onChange={this.handleChange} />
					<Label check className="form-check-label" for="none">None</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox ">
					<Input className="form-check-input" id="4" type="radio" name="faucet_center" value="4" title="4'" onChange={this.handleChange} />
					<Label check className="form-check-label" for="4">4'</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="8" type="radio" name="faucet_center" value="8" title="8'" onChange={this.handleChange} />
					<Label check className="form-check-label" for="8">8'</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="single" type="radio" name="faucet_center" value="single" title="Single" onChange={this.handleChange} />
					<Label check className="form-check-label" for="single">Single</Label>
					</FormGroup>					
				</Col>
			</FormGroup>
		
			{(condition.backsplash_hide !== true) ?
			<FormGroup row className={(this.state.selected.faucet_center === undefined) ? 'hide':''}>
				<Col md="3"><Label className="lable_title">Backsplash</Label></Col>
				<Col md="9">
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="no_backsplash" type="radio" name="backsplash" value="no_backsplash" title="No backsplash" onChange={this.handleChange} />
					<Label check className="form-check-label" for="no_backsplash">No backsplash</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="4_separate_backsplash" type="radio" name="backsplash" value="backsplash" title="4' Separate backsplash" onChange={this.handleChange} disabled={condition.bowl_backsplash_val} />
					<Label check className="form-check-label" for="4_separate_backsplash">4' Separate backsplash</Label>
					</FormGroup>
							
				</Col>
			</FormGroup>:''}
			
			<FormGroup row className={overflow_hide}>
				<Col md="3"><Label className="lable_title">Overflow</Label></Col>
				<Col md="9">
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="no_overflow" type="radio" name="overflow" value="no_overflow" title="Without overflow" onChange={this.handleChange} />
					<Label check className="form-check-label" for="no_overflow">Without overflow</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="with_overflow" type="radio" name="overflow" value="with_overflow" title="With overflow"  onChange={this.handleChange} disabled={condition.overflow_na} />
					<Label check className="form-check-label" for="with_overflow">With overflow</Label>
					</FormGroup>							
				</Col>
			</FormGroup>	

			<FormGroup row className={(this.state.selected.overflow === undefined) ? 'hide':''}>
				<Col md="3"><Label className="lable_title">Side Splash </Label></Col>
				<Col md="9" className="side_splash">
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="left_side_splash4" type="radio" name="side_splash" value="left_side_splash4" title="Left side splash (4')" onChange={this.handleChange} disabled={condition.leftside_4} />
					<Label check className="form-check-label" for="left_side_splash4">Left side splash (4')</Label>
					</FormGroup>
					
					<FormGroup check className="checkbox">
					<Input className="form-check-input" id="right_side_splash" type="radio" name="side_splash" value="right_side_splash" title="Right side splash (4')" onChange={this.handleChange} disabled={condition.rightside_4} />
					<Label check className="form-check-label" for="right_side_splash">Right side splash (4')</Label>
					</FormGroup>
										
					<FormGroup check className="checkbox">
						<Input className="form-check-input" id="left_side_splash35" type="radio" name="side_splash" value="left_side_splash35" title="Left side splash (3-1/2')" onChange={this.handleChange} disabled={condition.leftside_35} />
						<Label check className="form-check-label" for="left_side_splash35">Left side splash (3-1/2')</Label>
					</FormGroup>

					<FormGroup check className="checkbox">
						<Input className="form-check-input" id="right_side_splash35" type="radio" name="side_splash" value="right_side_splash35" title="Right side splash (3-1/2')" onChange={this.handleChange} disabled={condition.rightside_35} />
						<Label check className="form-check-label"for="right_side_splash35">Right side splash (3-1/2')</Label>
					</FormGroup>

					<FormGroup check className="checkbox" style={{'padding':'0'}}>
						
						<Label check className="form-check-label" style={condition.universalside_35 === true ? { color: '#ccc' }:{}} >Universal side splash (3-1/2')</Label>
						<div className="new_row">
							<span>
								<Input className="form-check-input" id="uss_1" type="radio" name="side_splash" value='uss_1' title="Universal side splash(3-1/2)  1" onChange={this.handleChange} disabled={condition.universalside_35} /><Label check className="form-check-label" for="uss_1">1 No</Label>
							</span>
							<span>
								<Input className="form-check-input" id="uss_2" type="radio" name="side_splash" value='uss_2' title="Universal side splash(3-1/2) 2" onChange={this.handleChange} disabled={condition.universalside_35} /><Label check className="form-check-label" for="uss_2">2 Nos </Label>
							</span>
						</div>						
					</FormGroup>
					
					<FormGroup check className="checkbox new_row_main">
						<Label check className="form-check-label lr" style={condition.universalside_4 === true ? { color: '#ccc' }:{}} >Universal side splash (4”) </Label>			
						<div className="new_row">
							<span>
								<Input className="form-check-input" id="1" type="radio" name="side_splash" value='1' title="Universal side splash(4) 1" onChange={this.handleChange} disabled={condition.universalside_4} /><Label check className="form-check-label" for="1">1 No</Label>
							</span>
							<span>
								<Input className="form-check-input" id="2" type="radio" name="side_splash" value='2' title="Universal side splash(4) 2" onChange={this.handleChange} disabled={condition.universalside_4} /><Label check className="form-check-label" for="2">2 Nos </Label>
							</span>
						</div>
			
					</FormGroup>
					
					<FormGroup check className="checkbox">
						<Input className="form-check-input" id="no_side_splash" type="radio" name="side_splash" value="no_side_splash" title="No side splash" onChange={this.handleChange} />
						<Label check className="form-check-label" for="no_side_splash">No side splash</Label>
					</FormGroup>					
										
							
				</Col>
			</FormGroup>			
			
            <Button type="submit" size="sm" color="primary" style={{'float':'right', 'marginTop':'15px'}}><i className="fa fa-dot-circle-o"></i> Submit</Button>
        </Form>			
			
            </CardBody>
          </Card>
        </Col>
		
		<Col xs="4" lg="4" id={this.state.quote_submit === true ? "price_right_submited" : "one" } className="price_display_fixed spo_price_result" >
				<div className="after_submit">
					<Button size="sm" color="primary" onClick={this.handleChangeAfterSubmit.bind(this, 'edit')} ><i className="fa fa-pencil"></i> Edit</Button>
					<NavLink href="/spoquote"><Button size="sm" color="primary" ><i className="fa fa-plus"></i> Add New</Button></NavLink>
					<Button size="sm" color="primary" onClick={this.toggle_comparission.bind(this)}>Compare To PS</Button>
				</div>		
				<div className="right">{this.PriceTab()}</div>
				
				{(this.state.quote_submit !== false) ? 
				<div className="left" style={this.state.addClass_PS === false ? { display: 'none' } : {display: 'block' } } >{this.render_otmatched_ps()}</div>:<div>-</div>}		
		</Col>
      </Row>
	 	 
	  
      </div>
    );
  }
}

export default Manage;
