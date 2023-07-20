<?php
// error_reporting(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);
if (!defined('BASEPATH')) exit('No direct script access allowed');  
require_once APPPATH."/third_party/PHPExcel.php";
$admin_discount = 0;
if($_GET['type'] == 'dealer'){
	$type_based_price['cands'] = 63.40;
	$type_based_price['drawer'] = 70;
	$admin_discount = isset($_GET['discount'])?$_GET['discount']:0;
}else if($_GET['type'] == 'builder'){
	$type_based_price['cands'] = 48.54;
	$type_based_price['drawer'] = 55;
	$admin_discount = isset($_GET['discount'])?$_GET['discount']:0;
}else if($_GET['type'] == 'oem'){
	$type_based_price['cands'] = 43.75;
	$type_based_price['drawer'] = 50;
	$admin_discount = isset($_GET['discount'])?$_GET['discount']:0;
}else{
	$type_based_price['cands'] = 0;
	$type_based_price['drawer'] = 0;
}

class Download extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('login_model');
		$this->load->model('download_model');
		$this->load->model('quotes_model');
		$this->load->model('customers_model');
		$this->load->model('dealer_model');
		$this->load->model('designer_model');
		$this->load->model('component_model');
		$this->load->model('codes_model');
		$this->load->model('price_mapping_model');
		$this->load->model('accessories_model');
		$this->load->library('PHPExcel');
        $this->load->library('session');
	}
	
	public function render_pdf($quote_id = NULL)
	{
	    global $admin_discount;
		$data = array();
		if(isset($quote_id)){
			$quote_id = $quote_id;
		}
		else {
			echo "Quote id not found";
			die;
		}
		
		$pdf_config['square_feet_price'] = 100;
		$pdf_config['inr_symbol'] = '&#8377; ';
		$data['quote_details'] = $this->quotes_model->get_by_id($quote_id);

		if($data['quote_details']['admin_revision'] != 0){
			$this->session->set_userdata("quote_id", $data['quote_details']['admin_revision']);
			$quote_lines = $this->quotes_model->get_quote_line_items($data['quote_details']['admin_revision']);
			$data['quote_details']['quote_number'] = $data['quote_details']['quote_number'].'-'.strtoupper($_GET['type']);
			
			$quote_lines_services = $this->quotes_model->get_quote_line_items_services($data['quote_details']['admin_revision']);
		}else{
			$quote_lines = $this->quotes_model->get_quote_line_items($quote_id);
			$quote_lines_services = $this->quotes_model->get_quote_line_items_services($quote_id);
			$this->session->set_userdata("quote_id", $quote_id);
		}

		$this->session->set_userdata("admin_discount", $admin_discount);
		$tmp = json_decode($data['quote_details']['admin_discount'], true);	
		if($tmp > 0){
			foreach($tmp as $type=>$discount){
				$this->session->set_userdata("admin_discount", $discount);
			}
		}else{
			$this->session->set_userdata("admin_discount", 0);
		}

 		$data['customer_details'] = $this->customers_model->get_by_id($data['quote_details']['customer_id']);
		$data['dealer_details'] = $this->dealer_model->get_by_id($data['quote_details']['dealer_id']);
		$data['designer_details'] = $this->designer_model->get_by_id($data['quote_details']['designer_id']); 

		if(isset($_GET['download']) == 'excel') {
			$this->excelWrite($quote_lines, $data['quote_details'], $data['customer_details']);
			die;
		}
		$data['quote_line_categories_items']=$this->get_quote_lines_by_categories($quote_lines, 'list', $data['quote_details']);
		$data['quote_line_categories']=$this->get_selected_option_html($data['quote_line_categories_items'],'list', $data['quote_details']);
// 		$data['cabinet_list'] = $this->render_selected_option($quote_lines, 'list', $data['quote_details']);
		$data['accessories_list'] = $this->render_acc($quote_lines, 'list',$pdf_config);
		$data['installation'] = $this->render_installation($data['quote_details'], $pdf_config, 'pdf');
		$data['services'] = $this->other_services($quote_lines_services);
		$data['summary'] = $this->render_summary_products($data['quote_details'], $data['quote_line_categories_items'], $pdf_config, 'pdf', $data['services']);
		$data['type'] = $_GET['type'];
	
		$this->load->view('download_view', $data);
	}

	public function other_services($services){
		global $pdf_config;
		if(count($services) < 0){
			return;
		}
		$s_no = 1;$html='';$total_price=0;
		foreach($services as $service){
			$total_price += $service['other_service_price'];
			$html .= '</tr><td align="center">'.$s_no.'</td><td>'.$service['other_service_name'].'</td><td align="right">'.$pdf_config['inr_symbol'].number_format($service['other_service_price']).'.00</td></tr>';
			$s_no++;
		}
		$html .= '<tr><td colspan="3" align="right">'.number_format($total_price).'.00</td></tr>';
		$html .= '<tr><td colspan="3" align="right" class="textupper">'.$this->number_to_word($total_price).'</td></tr>';
		$return['html'] = $html;
		$return['array'] = $services;
		$return['total_price'] = $total_price;
		return $return;
	}

	public function check_exist_quote_id($quote_id){ 
		$return = $this->quotes_model->get_by_id($quote_id);
		if(isset($quote_id) != NULL && $return['quote_id'] != NULL){
			return $quote_id = $quote_id;
		}
		else {
			echo "Quote id not found";
			die;
		}		
	}
	
	public function excel($quote_id = NULL){
		if(isset($_GET['token'])){
			$authorization = $_GET['token'];			
		}
		$this->login_model->checktoken_download($authorization);
		
		$pdf_config['square_feet_price'] = 100;
		$pdf_config['inr_symbol'] = '&#8377; ';		
		$this->check_exist_quote_id($quote_id);
		
		$data['quote_details'] = $this->quotes_model->get_by_id($quote_id);
		
		if($data['quote_details']['admin_revision'] != 0){
			$data['quote_lines'] = $this->quotes_model->get_quote_line_items($data['quote_details']['admin_revision']);
			$data['quote_details']['quote_number'] = $data['quote_details']['quote_number'].'-'.strtoupper($_GET['type']);
			$quote_lines_services = $this->quotes_model->get_quote_line_items_services($data['quote_details']['admin_revision']);
		}else{
			$data['quote_lines'] = $this->quotes_model->get_quote_line_items($quote_id);			
			$quote_lines_services = $this->quotes_model->get_quote_line_items_services($quote_id);
		}
		
		$data['customer_details'] = $this->customers_model->get_by_id($data['quote_details']['customer_id']);
		$data['services'] = $this->other_services($quote_lines_services);
		$data['installation'] = $this->render_installation($data['quote_details'], $pdf_config, 'excel');
		$data['summary'] = $this->render_summary($data['quote_details'], $data['quote_lines'], $pdf_config, 'excel', $data['services']);
		$data['designer_details'] = $this->designer_model->get_by_id($data['quote_details']['designer_id']);
		$data['dealer_details'] = $this->dealer_model->get_by_id($data['quote_details']['dealer_id']);
		
		$this->excelWrite($data);
		die;
	}	

	public function pdf($quote_id = NULL){
		global $admin_discount;
		$authorization = '';
		if(isset($_GET['token'])){
			$authorization = $_GET['token'];			
		}
		$this->login_model->checktoken_download($authorization);
		
		$this->check_exist_quote_id($quote_id);
		$quote = $this->quotes_model->get_by_id($quote_id);
		
		$quote_number = $quote_id;
		if($quote['admin_revision'] != 0){
			$quote_number = $quote_id.'-'.strtoupper($_GET['type']);
			$admin_discount = '&discount='.$admin_discount;
		}
		
		$dealer_details = $this->dealer_model->get_by_id($quote['dealer_id']);
		$year = $this->customers_model->get_by_id($quote['customer_id']);
		$year = str_replace('/', '-', $year['date_created']);
		$year = date('Y', strtotime($year));

		$fileName = 'MagickWoodsQuote_'.$_GET['type'].'_'.$dealer_details['label'].'-'.sprintf('%0' . 4 . 's', $quote_number).'.pdf';

		$quotefolder = 'quotes/dealer_'.$quote['dealer_id'].'/'.$year.'/customer_'.$quote['customer_id'];
		if (!file_exists($quotefolder)) {
				mkdir($quotefolder, 0777, true);
		}
	
		
		$filepath = $quotefolder.'/'.$fileName;
		$cmd = "--javascript-delay 1000 --page-size A4 --footer-center \"Page [page] of [toPage]\" --footer-font-size 11 --encoding utf-8 --resolve-relative-links --quiet --disable-smart-shrinking --load-error-handling ignore ".base_url()."download/render_pdf/".$quote_id."/?type=".$_GET['type']." ".$filepath;
		exec("wkhtmltopdf $cmd");



		if(file_exists($filepath)){
			$content = file_get_contents($filepath);
			header('Content-Type: application/pdf');
			header('Content-Description: File Transfer');
			header('Content-Transfer-Encoding: binary');
			header('Content-Length: '.strlen( $content ));
			header('Content-disposition: inline; filename="' .$fileName. '"');
			header('Cache-Control: public, must-revalidate, max-age=0');
			header('Pragma: public');
			header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
			header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
			header("Content-type:application/pdf");
			header("Content-Disposition:attachment;filename=".$fileName);
			readfile($filepath);			
			//echo $content;
			die;
		} else {
			echo 'Invalid file name or html to pdf generate issue';
			die;
		}		
	}	
	
	function excelWrite($data){
		$dealer_details = $data['dealer_details'];
		$quote_lines = $data['quote_lines'];
		$quote_details = $data['quote_details'];
		$customer_details = $data['customer_details'];
		$designer_details = $data['designer_details'];
		$installation = $data['installation'];
		$summary = $data['summary'];

		$cabinet_results = $this->render_selected_option($quote_lines, 'excel', $quote_details);
		$accessories_results = $this->render_acc($quote_lines, 'excel');
		
		$fileName = 'MagickWoodsQuote_'.$_GET['type'].'_'.$quote_details['quote_number'];
		
		$collectedTrackDeatails = array();
		$objPHPExcel = new PHPExcel();

		$objPHPExcel->getProperties()->setCreator("Magickwoods")
								 ->setLastModifiedBy("Admin")
								 ->setTitle("Dealer Application Quote Document")
								 ->setSubject("Dealer Application Quote Document")
								 ->setDescription("Dealer Application Quote Document");

		$allDataInSheet = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true);	
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(false);
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth("30");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(false);
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth("30");	
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(false);
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth("30");
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(false);
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth("30");

		/*left-first-section*/
		$graybg = array('A2', 'A3', 'A4', 'A5', 'A6', 'A7',  'A8', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15',  'A16', 'A17', 'A18', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',  'C8', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15',  'C16', 'C17', 'C18');
		
		foreach($graybg as $col){
		 $objPHPExcel->getActiveSheet()
			->getStyle($col)
			->getFill()
			->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
			->getStartColor()
			->setRGB('F9F9F9');		
		}

		$fontbold = array('B2', 'B3', 'B4', 'B5', 'B6', 'B7',  'B8', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15',  'B16', 'B17', 'B18', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7',  'D8', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15',  'D16', 'D17', 'D18', 'A20', 'A23', 'A28', 'B28', 'E28', 'F28', 'G28', 'H28', 'I28', 'C28', 'D28', 'A1', 'B1');
		
		foreach($fontbold as $col){
			$Array = array(
				'font'  => array(
					'bold'  => true
				));
			$objPHPExcel->getActiveSheet()->getStyle($col)->applyFromArray($Array);	
		}	

		/*Header*/
		$objPHPExcel->getActiveSheet(1)->setCellValue('A1', $_GET['type'].': Quotation');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B1', '');
		/*End-Header*/
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('A2', 'Date');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A3', 'Qtn. No.');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A4', 'Warranty');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A5', 'Dwg. No.');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A6', 'Site Engr.');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A7', 'Details');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A8', 'Customer Id');
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('A10', 'Designer');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A11', 'Model');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A12', 'Glass');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A13', 'Worktop');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A14', 'Backsplash');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A15', 'Cornice');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A16', 'Ducting');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A17', 'Gas piping:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A18', 'Dado Tile Laying');
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('B2', date("j-F-Y"));
		$objPHPExcel->getActiveSheet(1)->setCellValue('B3', $quote_details['quote_number']);
		$objPHPExcel->getActiveSheet(1)->setCellValue('B4', '5 Years');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B5', '');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B6', '');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B7', 'Kitchen');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B8', $customer_details['cid']);
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('B10', $designer_details['name']);
		$objPHPExcel->getActiveSheet(1)->setCellValue('B11', 'NA');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B12', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B13', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B14', 'NA');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B15', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B16', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B17', 'Dealer Scope');
		
		/*left-first-section*/	
		
		/*right-first-section*/	
		$objPHPExcel->getActiveSheet(1)->setCellValue('C2', 'Client name:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C3', 'Cont Address:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C4', 'Billing in the name of:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C5', 'Site Address:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C6', 'Architect.');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C7', 'Telephone:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C8', 'Email address:');
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('C10', 'Hob:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C11', 'Sink:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C12', 'Faucet:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C13', 'Vapourhood:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C14', 'Oven:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C15', 'Microwave:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C16', 'Dishwasher:');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C17', 'Fridge:');
		
		if($quote_details['quoteforname'] == ''){
			$quote_details['quoteforname'] = $customer_details['name'];
		}
		$objPHPExcel->getActiveSheet(1)->setCellValue('D2', $quote_details['quoteforname']);
		$objPHPExcel->getActiveSheet(1)->setCellValue('D3', $customer_details['address']);
		$objPHPExcel->getActiveSheet(1)->setCellValue('D4', $quote_details['name']);
		$objPHPExcel->getActiveSheet(1)->setCellValue('D5', '');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D6', '');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D7', $customer_details['phone']);
		$objPHPExcel->getActiveSheet(1)->setCellValue('D8', $customer_details['email']);
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('D10', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D11', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D12', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D13', 'Dealer Scope');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D14', 'NA');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D15', 'NA');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D16', 'NA');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D17', 'NA');
		
		$objPHPExcel->getActiveSheet(1)->mergeCells('A20:B20:C:20');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A20', 'Additional Information if any');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A21', 'CLIENT SIGNATURE');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D21', 'AUTHORIZED SIGNATORY');
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('A23', 'STORAGE SYSTEM');
		$objPHPExcel->getActiveSheet(1)->setCellValue('A24', 'All Doors & Pan Drawers units will be by Soft closed Channels & Spft closed Hinges');
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('A28', 'Cabinet List');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B28', 'Carcass');
		$objPHPExcel->getActiveSheet(1)->setCellValue('C28', 'Shutter');
		$objPHPExcel->getActiveSheet(1)->setCellValue('D28', 'Hinges');
		$objPHPExcel->getActiveSheet(1)->setCellValue('E28', 'Drawers');
		$objPHPExcel->getActiveSheet(1)->setCellValue('F28', 'Handles');
		$objPHPExcel->getActiveSheet(1)->setCellValue('G28', 'Flap Up');
		$objPHPExcel->getActiveSheet(1)->setCellValue('H28', 'Qty');
		$objPHPExcel->getActiveSheet(1)->setCellValue('I28', 'Price');
		
		$col = '28';
		foreach($cabinet_results as $key => $cabinet){
			foreach($cabinet['ret'] as $ret){
				$col++;
				$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$col, ucwords($key).' - '.strip_tags($ret['code_description']));
				$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$col, $ret['carcass_name']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('C'.$col, $ret['shutter_name']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('D'.$col, $ret['hinges_name']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('E'.$col, $ret['drawers_name']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('F'.$col, $ret['handles_name']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('G'.$col, $ret['flap_up_name']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('H'.$col, $ret['sum_quantity']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('I'.$col, $ret['cabinet_price']);					
			}
		}
		$col = $col+1;
		$objPHPExcel->getActiveSheet(1)->setCellValue('I'.$col, number_format($cabinet_results['total_price']));
		
		
		if($summary['acc_price'] != 0){
			$col = $col+1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$col, 'Accessories List');
			$objPHPExcel->getActiveSheet()->getStyle( 'A'.$col )->getFont()->setBold( true );
			
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$col, 'Quantity');
			$objPHPExcel->getActiveSheet()->getStyle( 'B'.$col )->getFont()->setBold( true );
			
			$objPHPExcel->getActiveSheet(1)->setCellValue('C'.$col, 'Price');
			$objPHPExcel->getActiveSheet()->getStyle( 'C'.$col )->getFont()->setBold( true );	
		
		
			$accessories_total_price = 0; $ac_no = 0;
			$ac_col = $col; 
			foreach($accessories_results as $accessories){
				$ac_col++;
				$accessories_total_price += $accessories['price']; 
				$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, $accessories['name'].' - '.$accessories['code']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, $accessories['qty']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('C'.$ac_col, $accessories['price']);
			}
			$ac_col = $ac_col + 1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('C'.$ac_col, number_format($accessories_total_price));
		}else{
			$ac_col = $col;
		}

		if($data['services']['total_price'] != 0){
			$ac_col = $ac_col+1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Service Name');
			$objPHPExcel->getActiveSheet()->getStyle( 'A'.$ac_col )->getFont()->setBold( true );
			
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, 'Service Price');
			$objPHPExcel->getActiveSheet()->getStyle( 'B'.$ac_col )->getFont()->setBold( true );	
		
		
			$ac_no = 0;
			$ac_col = $ac_col; 
			foreach($data['services']['array'] as $service){
				$ac_col++; 
				$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, $service['other_service_name']);
				$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, $service['other_service_price']);
			}
			$ac_col = $ac_col + 1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, number_format($data['services']['total_price']));
		}
		
		if($_GET['type'] == 'customer'){
			$ac_col = $ac_col + 2;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Installation');
			$objPHPExcel->getActiveSheet()->getStyle( 'A'.$ac_col )->getFont()->setBold( true );
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, 'Price');
			$objPHPExcel->getActiveSheet()->getStyle( 'B'.$ac_col )->getFont()->setBold( true );
		
			$ac_col = $ac_col + 1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, $installation['details']);
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, $installation['price']);
		}
		$ac_col = $ac_col + 2;
		$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Summary');
		$objPHPExcel->getActiveSheet()->getStyle( 'A'.$ac_col )->getFont()->setBold( true );

		$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, 'Price');
		$objPHPExcel->getActiveSheet()->getStyle( 'B'.$ac_col )->getFont()->setBold( true );
		
				
		$ac_col = $ac_col + 1;
		
		$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Cabinet Price');
		$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, number_format($summary['cab_price']));		
		
		if($summary['cab_discount'] != 0 && $_GET['type'] == 'customer'){
			$ac_col = $ac_col + 1;	
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Cabinet Discount');
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, '- '.number_format($summary['cab_discount']));
		}
		if($summary['acc_price'] != 0){
			$ac_col = $ac_col + 1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Accessories Price');
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, number_format($summary['acc_price']));		
		}
		if($summary['acc_discount'] != 0 && $_GET['type'] == 'customer'){
			$ac_col = $ac_col + 1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Accessories Discount');
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, '- '.number_format($summary['acc_discount']));	
		}
		if($_GET['type'] == 'customer'){
			$ac_col = $ac_col + 1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Installation');
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, number_format($summary['installation_price']));
		}	
		if($data['services']['total_price'] > 0){
			$ac_col = $ac_col + 1;
			$objPHPExcel->getActiveSheet(1)->setCellValue('A'.$ac_col, 'Other Services');
			$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, number_format($data['services']['total_price']));
		}			
		
		$ac_col = $ac_col + 1;
		$objPHPExcel->getActiveSheet(1)->setCellValue('B'.$ac_col, number_format($summary['total']));		
		

		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="' . $fileName . '.xls"');
		header('Cache-Control: max-age=0');				
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save('php://output');
		die;
	}	
	

	public function quote_discount($ap, $discount){
		if($discount > 0){
			return ($ap * ($discount / 100));
		}
		return $ap;
	}
	public function quote_discount_decrease($ap, $discount){
		if($discount > 0){
			return $ap-($ap * ($discount / 100));
		}
		return $ap;
	}	
	public function render_selected_option($quote_lines, $return, $quote_details) {
		global $type_based_price;
/* 		$admin_discount = 0;
		$admin_discount = $this->session->userdata("admin_discount"); */
		$pdf_config['square_feet_price'] = 100;
		$pdf_config['inr_symbol'] = '&#8377; ';
		$price_master = $this->price_mapping_model->price_mapping();
		$cabinets = array();
		$html = $base_title = $wall_title = $tall_title = $others_title = $html_base = $html_wall = $html_tall = $html_others = ''; 
		
		$temp_total_price = 0;
		foreach($quote_lines as $key => $quote_line) {
			$cabinet_price = 0;
			$cabinet_price += $this->quote_discount($price_master[$quote_line['code_id']][$quote_line['cabinet_carcass_id']], $type_based_price['cands']);	
			$cabinet_price += $this->quote_discount($price_master[$quote_line['code_id']][$quote_line['cabinet_shutter_id']], $type_based_price['cands']);
			$cabinet_price += $this->quote_discount($price_master[$quote_line['code_id']][$quote_line['drawers_id']], $type_based_price['drawer']);
			$cabinet_price += $price_master[$quote_line['code_id']][$quote_line['hinges_id']];
			$cabinet_price += $price_master[$quote_line['code_id']][$quote_line['handles_id']];
			$cabinet_price += $price_master[$quote_line['code_id']][$quote_line['flap_up_id']];
			
			if(isset($quote_details['rules']) && isset($quote_details['rules']->discount) && $quote_details['rules']->discount->ec_discount != ''){
				$cabinet_price = $cabinet_price - $cabinet_price * $quote_details['rules']->discount->ec_discount/100;//only @home-dealer
			}
			
			
			//$cabinet_price = $this->quote_discount_decrease($cabinet_price, $admin_discount);
			if($quote_line['cabinet_type_id']=='Wall'){
				$cabinets['wall'][$key] = array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
			} 
			else if($quote_line['cabinet_type_id']=='Base'){
				$cabinets['base'][$key]= array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
			}
			else if($quote_line['cabinet_type_id']=='Tall'){
				$cabinets['tall'][$key] = array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
			}else{
				$cabinets['others'][$key] = array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
			}
		}

		$table_colspan_count = 8;
		if( $quote_details['show_cabinetprice'] == 1 ) {
			$table_colspan_count = 9;
		}
		
		$base_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Base Cabinet</b></td></tr>';				
		$tall_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Tall Cabinet</b></td></tr>';
		$wall_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Wall Cabinet</b></td></tr>';	
		$others_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Others Cabinet</b></td></tr>';	

		$html_base = $this->form_quote_item($cabinets['base'], 1,$quote_details['show_cabinetprice']);
		$html_tall = $this->form_quote_item($cabinets['tall'], $html_base['s_no'],$quote_details['show_cabinetprice']);
		$html_wall = $this->form_quote_item($cabinets['wall'], $html_tall['s_no'],$quote_details['show_cabinetprice']);
		$html_others = $this->form_quote_item($cabinets['others'], $html_wall['s_no'],$quote_details['show_cabinetprice']);
		$temp_total_price = $html_base['price']+$html_tall['price']+$html_wall['price']+$html_others['price'];
		$cabinet_total_price = '<tr><td colspan="'.$table_colspan_count.'" align="right">Total Price: </td><td align="right">'.$pdf_config['inr_symbol'].' '.number_format($temp_total_price).'.00</td></tr><tr><td colspan="'.($table_colspan_count+1).'" align="right" style="text-transform:uppercase;">'.$this->number_to_word($temp_total_price).'</td></tr>';

		if($return == 'price'){
			return $temp_total_price;
		}

		if($return == 'excel'){
			$ret_excel = array(
				'base' => $html_base,
				'tall' => $html_tall,
				'wall' => $html_wall,
				'others' => $html_others,
				'total_price' => $temp_total_price
			);		
			return $ret_excel;
		}
		
		if($return == 'list'){
			return $this->check_cabinet_row($html_base['html'],$base_title).$this->check_cabinet_row($html_tall['html'],$tall_title).$this->check_cabinet_row($html_wall['html'],$wall_title).$this->check_cabinet_row($html_others['html'],$others_title).$cabinet_total_price;
		}
	}
	public function check_cabinet_row($html_type, $type_title){
		if($html_type != ''){
			return $type_title.$html_type;
		}
	}

	public function render_value($value){
		if($value == ''){
			return '-';
		}else{
			return $value;
		}
	}
	public function form_quote_item($cabinets, $s_no,$show_cabinetprice=1){
		$html = '';$temp_total_price = 0;
		$pdf_config['square_feet_price'] = 100;
		$pdf_config['inr_symbol'] = '&#8377; ';
		$component_master = $this->component_model->get_lists();
		$code_masters = $this->codes_model->get_lists();
		
		foreach($code_masters as $row){
			$code_master[$row['id']] = $row;
		}

// 		print_r(json_encode($cabinets));
// 		exit;
		
		$ret = array();
		foreach($cabinets as $key => $row){
			$temp_total_price += $row['cabinet_price'] * $row['component']['sum_quantity'];		
			$ret[$key]['code_description'] = $code_master[$row['code']]['code'].'</b> - '.$code_master[$row['code']]['description'];
			$ret[$key]['carcass_name'] = $component_master[$row['component']['cabinet_carcass_id']]['component_name'];
			$ret[$key]['shutter_name'] = $component_master[$row['component']['cabinet_shutter_id']]['component_name'];
			$ret[$key]['drawers_name'] = $component_master[$row['component']['drawers_id']]['component_name'];
			$ret[$key]['hinges_name'] = $component_master[$row['component']['hinges_id']]['component_name'];
			$ret[$key]['handles_name'] = $component_master[$row['component']['handles_id']]['component_name'];
			$ret[$key]['flap_up_name'] = $component_master[$row['component']['flap_up_id']]['component_name'];
			$ret[$key]['sum_quantity'] = $row['component']['sum_quantity'];
			$ret[$key]['cabinet_price'] = number_format($row['cabinet_price'] * $ret[$key]['sum_quantity']); 
			
			$html .= '<tr><td align="center">'.$s_no.'</td>
			<td><b>'.$ret[$key]['code_description'].'</td>
			<td>'.$this->render_value($ret[$key]['carcass_name']).'</td>
			<td>'.$this->render_value($ret[$key]['shutter_name']).'</td>
			<td>'.$this->render_value($ret[$key]['hinges_name']).'</td>
			<td>'.$this->render_value($ret[$key]['drawers_name']).'</td>
			<td>'.$this->render_value($ret[$key]['handles_name']).'</td>
			<td>'.$this->render_value($ret[$key]['flap_up_name']).'</td>
			<td '.(( $show_cabinetprice == 0 )?'style="text-align: center;"':'').'>'.$this->render_value($ret[$key]['sum_quantity']).'</td>';

			if( $show_cabinetprice == 1 ) {
				$html .='<td align="right">'.$pdf_config['inr_symbol'].' '.$ret[$key]['cabinet_price'].'.00</td>';
			}
			$html .='</tr>';			
			$s_no++;
		}
		$return['s_no'] = $s_no;
		$return['html'] = $html;
		$return['ret'] = $ret;
		$return['price'] = $temp_total_price;
		return $return;
	}	

	function render_acc($quote_lines, $return,$pdf_config=NULL) {
		
		$accessories_master = $this->accessories_model->get_lists();
		$html = '';$total_price = 0; $price = 0;	$resultArray = array();
		
		$quote_id = $this->session->userdata("quote_id");
		$quote_lines = $this->quotes_model->api_get_quote_line_items($quote_id);	
		foreach($quote_lines as $key => $line) {
			if(isset($line['accessories'])) {
					foreach(json_decode($line['accessories']) as $accid => $qty) {
						$acc = $accessories_master[$accid];
						if($accid != '' && $accid != 0 && $qty > 0){	
							$price = $qty * $acc['price'];
							$resultArray[$accid]['name'] =  $acc['name'];
							$resultArray[$accid]['code'] =  $acc['code'];
							if(isset($resultArray[$accid]) && !isset($resultArray[$accid]['price'])){
								$resultArray[$accid]['price'] =  $price;
								$resultArray[$accid]['qty'] =  $qty;
							}else{
								$resultArray[$accid]['price'] +=  $price;
								$resultArray[$accid]['qty'] +=  $qty;
							}	
						}
					}
			}
				
		}
		$i = 1;
		if(count($resultArray) > 0){
			$html.='<thead class="color_orange">
			  <tr>
				<th width="30">S.No</th>
				<th>Accessories Code & Name</th>
				<th class="text-center" width="100">Qty</th>
				<th class="text-right" width="100">Price</th>
			  </tr>
			</thead><tbody>';
			foreach ($resultArray as $key => $value){
				$total_price += $value['price'];
				$html .= '<tr><td align="center">'.$i.'</td><td><b>'.$value['code']. ' - </b>'.$value['name'].'</td><td align="center">'.$value['qty'].'</td><td align="right">'.$pdf_config['inr_symbol'].' '.number_format($value['price']).'.00</td></tr>';
				$i++;
			}
			$html.='</tbody><tr><td colspan="3" align="right">Total Price: </td><td align="right">'.$pdf_config['inr_symbol'].' '.number_format($total_price).'.00</td></tr><tr><td colspan="4" align="right" style="text-transform:uppercase;">'.$this->number_to_word($total_price).'</td></tr>';		
		}else {
			$html .='<tr><td align="center" colspan="4">No Accessories Selected</td></tr>';
		}
		
		if($return == 'excel') {
			return $resultArray;
		}
		if($return == 'price') {
			return $total_price;
		}	
		if($return == 'list') {
			return $html;
		}
	}	
	function render_installation($quote_details, $pdf_config, $return){		
		if($_GET['type'] != 'customer'){
			$square_feet = $quote_details['admin_square_feet'];
		}else{
			$square_feet = $quote_details['square_feet'];
		}
		if(isset($quote_details['rules']) && isset($quote_details['rules']->discount) && $quote_details['rules']->discount->installation_cost == 'no'){
			return;
		}		
		
		$data['details'] = $pdf_config['square_feet_price'].' Per Square Feet ('.$square_feet.' X '.$pdf_config['square_feet_price'].')';
		$data['price'] = number_format($square_feet * $pdf_config['square_feet_price']).'.00';
		if($return == 'pdf'){
			return '<tr>
				<td align="center">1</td>
				<td>'.$data['details'].'</td>
				<td align="right">'.$pdf_config['inr_symbol'].$data['price'].'</td></tr>
				<tr><td colspan="2" align="right">Total Price</td><td align="right">'.$pdf_config['inr_symbol'].' '.number_format($square_feet * $pdf_config['square_feet_price']).'.00</td></tr>
				<tr><td colspan="3" align="right" class="textupper">'.$this->number_to_word($square_feet * $pdf_config['square_feet_price']).'</td></tr>';
		}else{
			return $data;
		}	
	}

	function render_summary($quote_details, $quote_lines, $pdf_config, $return, $services) {
		$cab_discount = 0;
		$acc_discount = 0;
		$installation_price = 0;
		$admin_discount = 0;
		$grand_total=$ret_installation=$services_html='';
		$admin_discount = $this->session->userdata("admin_discount");
		
		$acc_price = $this->render_acc($quote_lines, 'price',$pdf_config);
		$cab_price = $this->render_selected_option($quote_lines, 'price', $quote_details);
		if($_GET['type'] == 'customer'){
			$cab_discount = ($quote_details['cabinet_discount'] / 100) * $cab_price;
			$acc_discount = ($quote_details['accessories_discount'] / 100) * $acc_price;
			$installation_price = $quote_details['square_feet'] * $pdf_config['square_feet_price'];
		}else{	
			$cab_discount = ($admin_discount / 100) * $cab_price;
			$installation_price = $quote_details['admin_square_feet'] * $pdf_config['square_feet_price'];
		}
		
		if(isset($quote_details['rules'])  && $quote_details['rules']->discount->installation_cost == 'no'){
			$installation_price = 0;
		}
		
		$total = ($acc_price - $acc_discount) + ($cab_price - $cab_discount) + $installation_price + $services['total_price'];
		
		$accessories_discount = '';
		$accessories_price = '';
		$cabinet_discount = '';
		$s_no = 0;

		if($cab_price > 0){
			$s_no = $s_no + 1;
			$cabinet_price = '<tr>
					<td align="center">'.$s_no.'</td>
					<td>Cabinet Price</td>
					<td align="right">'.$pdf_config['inr_symbol'].number_format($cab_price).'.00</td>
				</tr>';
		}
		if($admin_discount > 0 && $_GET['type'] != 'customer'){
			$cabinet_discount = '<tr>				
				<td align="center"></td>				
				<td>'.ucfirst($_GET['type']).' Cabinet Discount: '.$admin_discount.'%</td>
				<td align="right"><b> - </b>'.$pdf_config['inr_symbol'].number_format($cab_discount).'.00</td>
			</tr>';		
		}		
		if($quote_details['cabinet_discount'] > 0 && $cab_discount > 0 && $_GET['type'] == 'customer'){
			$cabinet_discount = '<tr>				
				<td align="center"></td>				
				<td>Cabinet Discount: '.$quote_details['cabinet_discount'].'%</td>
				<td align="right"><b> - </b>'.$pdf_config['inr_symbol'].number_format($cab_discount).'.00</td>
			</tr>';		
		}	
		if($quote_details['accessories_discount'] > 0 && $acc_discount > 0 && $_GET['type'] == 'customer'){
			$accessories_discount = '<tr>				
				<td align="center"></td>
				<td>Accessories Discount: '.$quote_details['accessories_discount'].'%</td>
				<td align="right"><b> - </b>'.$pdf_config['inr_symbol'].number_format($acc_discount).'.00</td>
			</tr>';		
		}
		if($acc_price > 0){
			$s_no = $s_no + 1;
			$accessories_price = '<tr>				
					<td align="center">'.$s_no.'</td>
					<td>Accessories Price</td>
					<td align="right">'.$pdf_config['inr_symbol'].number_format($acc_price).'.00</td>
				</tr>';
		}	
		
		if($services['total_price'] > 0){
			$s_no = $s_no + 1;
			$services_html = '<tr>				
					<td align="center">'.$s_no.'</td>
					<td>Other Services Price</td>
					<td align="right">'.$pdf_config['inr_symbol'].number_format($services['total_price']).'.00</td>
				</tr>';
		}	
		if(isset($quote_details['rules']) && $quote_details['rules']->discount->installation_cost != 'no'){
			$s_no = $s_no + 1;
			$ret_installation = '<tr>				
							<td align="center">'.$s_no.'</td>
							<td>Installation</td>
							<td align="right">'.$pdf_config['inr_symbol'].number_format($installation_price).'.00</td>
						</tr>';	
		}				
					
		$grand_total .= '<tr>
						<td colspan="2" align="right" class="color_orange">Grand Total:</td>
						<td align="right">'.$pdf_config['inr_symbol'].number_format($total).'.00</td>
					</tr>
					<tr>
						<td colspan="3" align="right" class="textupper">'.$this->number_to_word($total).'</td>
					</tr>';		
		if($return == 'pdf'){
			return $cabinet_price.$cabinet_discount.$accessories_price.$accessories_discount.$ret_installation.$services_html.$grand_total;
		}else{
			$data['acc_price'] = $acc_price;
			$data['acc_discount'] = $acc_discount;
			$data['cab_price'] = $cab_price;
			$data['cab_discount'] = $cab_discount;
			$data['installation_price'] = $installation_price;
			$data['total'] = $total;
			return $data;
		}		
	}
	
	
	
	public function get_quote_lines_by_categories($quote_lines, $return, $quote_details){
	    
	    $grouped_quote_lines = [];
        foreach ($quote_lines as $quote_line) {
        $category = $quote_line['category_name'];
        $subcategory = $quote_line['subcategory_name'];
        $product = $quote_line['product_name'];
    
        if (!isset($grouped_quote_lines[$category])) {
            $grouped_quote_lines[$category] = [];
        }
        if (!isset($grouped_quote_lines[$category][$subcategory])) {
            $grouped_quote_lines[$category][$subcategory] = [];
        }
        if (!isset($grouped_quote_lines[$category][$subcategory][$product])) {
            $grouped_quote_lines[$category][$subcategory][$product] = [];
        }

        $grouped_quote_lines[$category][$subcategory][$product][] = $quote_line;
        }

        return $grouped_quote_lines;
	    
	}
	
	public function get_selected_option_html($grouped_quote_lines,$return, $quote_details){
	    // Iterate through the grouped quote lines to access quote lines of each product
	    $total_price=0;
        foreach ($grouped_quote_lines as $category => $subcategories) {
            foreach ($subcategories as $subcategory => $products) {
                if($return=='price'){
                    $total_price+=$this->render_selected_option_product($products,$return,$quote_details);
                }else{
                    $grouped_quote_lines[$category][$subcategory]=$this->render_selected_option_product($products,$return,$quote_details);
                }
                
                
                
            }
        }
       if($return=='price'){
           return $total_price;
       }else{
           return $grouped_quote_lines;
       }
        
	}
	
	
	
	public function render_selected_option_product($quote_lines_products, $return, $quote_details) {
		global $type_based_price;
/* 		$admin_discount = 0;
		$admin_discount = $this->session->userdata("admin_discount"); */
		$pdf_config['square_feet_price'] = 100;
		$pdf_config['inr_symbol'] = '&#8377; ';
		$price_master = $this->price_mapping_model->price_mapping();
		$cabinets = array();
		$html=[];
		$html_content='';
		
	
		
// 		$html = $base_title = $wall_title = $tall_title = $others_title = $html_base = $html_wall = $html_tall = $html_others = ''; 
		$table_colspan_count = 8;
		if( $quote_details['show_cabinetprice'] == 1 ) {
			$table_colspan_count = 9;
		}
		$temp_total_price = 0;
		foreach($quote_lines_products as $product=>$quote_lines){
		    $updatedQuoteLines=[];
		foreach($quote_lines as $key => $quote_line) {
			$cabinet_price = 0;
			$cabinet_price += $this->quote_discount($price_master[$quote_line['code_id']][$quote_line['cabinet_carcass_id']], $type_based_price['cands']);	
			$cabinet_price += $this->quote_discount($price_master[$quote_line['code_id']][$quote_line['cabinet_shutter_id']], $type_based_price['cands']);
			$cabinet_price += $this->quote_discount($price_master[$quote_line['code_id']][$quote_line['drawers_id']], $type_based_price['drawer']);
			$cabinet_price += $price_master[$quote_line['code_id']][$quote_line['hinges_id']];
			$cabinet_price += $price_master[$quote_line['code_id']][$quote_line['handles_id']];
			$cabinet_price += $price_master[$quote_line['code_id']][$quote_line['flap_up_id']];
			
			if(isset($quote_details['rules']) &&  $quote_details['rules']->discount->ec_discount != ''){
				$cabinet_price = $cabinet_price - $cabinet_price * $quote_details['rules']->discount->ec_discount/100;//only @home-dealer
			}
			
			   $updatedQuoteLines[]= array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
    		    
        		  
		   
		   }
		   $quote_item = $this->form_quote_item($updatedQuoteLines, 1,$quote_details['show_cabinetprice']);
		   
		   
		    if(isset($quote_item)){
        		       $temp_total_price+=$quote_item['price'];
        		   }
		   
		   $title='<tr><td></td><td colspan="'.$table_colspan_count.'"><b>'.$product.'</b></td></tr>';	
		   if($return == 'list'){
			$html_content.= $this->check_cabinet_row($quote_item['html'],$title);
		}
		}

		
		
// 			//$cabinet_price = $this->quote_discount_decrease($cabinet_price, $admin_discount);
// 			if($quote_line['cabinet_type_id']=='Wall'){
// 				$cabinets['wall'][$key] = array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
// 			} 
// 			else if($quote_line['cabinet_type_id']=='Base'){
// 				$cabinets['base'][$key]= array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
// 			}
// 			else if($quote_line['cabinet_type_id']=='Tall'){
// 				$cabinets['tall'][$key] = array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
// 			}else{
// 				$cabinets['others'][$key] = array('code' => $quote_line['code_id'], 'component' => $quote_line, 'cabinet_price' => $cabinet_price);
// 			}
		
// 		$base_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Base Cabinet</b></td></tr>';				
// 		$tall_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Tall Cabinet</b></td></tr>';
// 		$wall_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Wall Cabinet</b></td></tr>';	
// 		$others_title = '<tr><td></td><td colspan="'.$table_colspan_count.'"><b>Others Cabinet</b></td></tr>';	

// 		$html_base = $this->form_quote_item($cabinets['base'], 1,$quote_details['show_cabinetprice']);
// 		$html_tall = $this->form_quote_item($cabinets['tall'], $html_base['s_no'],$quote_details['show_cabinetprice']);
// 		$html_wall = $this->form_quote_item($cabinets['wall'], $html_tall['s_no'],$quote_details['show_cabinetprice']);
// 		$html_others = $this->form_quote_item($cabinets['others'], $html_wall['s_no'],$quote_details['show_cabinetprice']);
// 		$temp_total_price = $html_base['price']+$html_tall['price']+$html_wall['price']+$html_others['price'];
		$cabinet_total_price = '<tr><td colspan="'.$table_colspan_count.'" align="right">Total Price: </td><td align="right">'.$pdf_config['inr_symbol'].' '.number_format($temp_total_price).'.00</td></tr><tr><td colspan="'.($table_colspan_count+1).'" align="right" style="text-transform:uppercase;">'.$this->number_to_word($temp_total_price).'</td></tr>';

		if($return == 'price'){
			return $temp_total_price;
		}

		if($return == 'excel'){
			$ret_excel = array(
				'base' => $html_base,
				'tall' => $html_tall,
				'wall' => $html_wall,
				'others' => $html_others,
				'total_price' => $temp_total_price
			);		
			return $ret_excel;
		}
		
// 		if($return == 'list'){
// 			return $this->check_cabinet_row($html_base['html'],$base_title).$this->check_cabinet_row($html_tall['html'],$tall_title).$this->check_cabinet_row($html_wall['html'],$wall_title).$this->check_cabinet_row($html_others['html'],$others_title).$cabinet_total_price;
// 		}

        return $html_content.$cabinet_total_price;
	}
	
	
	function render_summary_products($quote_details, $quote_lines, $pdf_config, $return, $services) {
		$cab_discount = 0;
		$acc_discount = 0;
		$installation_price = 0;
		$admin_discount = 0;
		$grand_total=$ret_installation=$services_html='';
		$admin_discount = $this->session->userdata("admin_discount");
		
		$acc_price = $this->render_acc($quote_lines, 'price',$pdf_config);
		$cab_price = $this->get_selected_option_html($quote_lines, 'price', $quote_details);
		if($_GET['type'] == 'customer'){
			$cab_discount = ($quote_details['cabinet_discount'] / 100) * $cab_price;
			$acc_discount = ($quote_details['accessories_discount'] / 100) * $acc_price;
			$installation_price = $quote_details['square_feet'] * $pdf_config['square_feet_price'];
		}else{	
			$cab_discount = ($admin_discount / 100) * $cab_price;
			$installation_price = $quote_details['admin_square_feet'] * $pdf_config['square_feet_price'];
		}
		
		if(isset($quote_details['rules']) && $quote_details['rules']->discount->installation_cost == 'no'){
			$installation_price = 0;
		}
		
		$total = ($acc_price - $acc_discount) + ($cab_price - $cab_discount) + $installation_price + $services['total_price'];
		
		$accessories_discount = '';
		$accessories_price = '';
		$cabinet_discount = '';
		$s_no = 0;

		if($cab_price > 0){
			$s_no = $s_no + 1;
			$cabinet_price = '<tr>
					<td align="center">'.$s_no.'</td>
					<td>Cabinet Price</td>
					<td align="right">'.$pdf_config['inr_symbol'].number_format($cab_price).'.00</td>
				</tr>';
		}
		if($admin_discount > 0 && $_GET['type'] != 'customer'){
			$cabinet_discount = '<tr>				
				<td align="center"></td>				
				<td>'.ucfirst($_GET['type']).' Cabinet Discount: '.$admin_discount.'%</td>
				<td align="right"><b> - </b>'.$pdf_config['inr_symbol'].number_format($cab_discount).'.00</td>
			</tr>';		
		}		
		if($quote_details['cabinet_discount'] > 0 && $cab_discount > 0 && $_GET['type'] == 'customer'){
			$cabinet_discount = '<tr>				
				<td align="center"></td>				
				<td>Cabinet Discount: '.$quote_details['cabinet_discount'].'%</td>
				<td align="right"><b> - </b>'.$pdf_config['inr_symbol'].number_format($cab_discount).'.00</td>
			</tr>';		
		}	
		if($quote_details['accessories_discount'] > 0 && $acc_discount > 0 && $_GET['type'] == 'customer'){
			$accessories_discount = '<tr>				
				<td align="center"></td>
				<td>Accessories Discount: '.$quote_details['accessories_discount'].'%</td>
				<td align="right"><b> - </b>'.$pdf_config['inr_symbol'].number_format($acc_discount).'.00</td>
			</tr>';		
		}
		if($acc_price > 0){
			$s_no = $s_no + 1;
			$accessories_price = '<tr>				
					<td align="center">'.$s_no.'</td>
					<td>Accessories Price</td>
					<td align="right">'.$pdf_config['inr_symbol'].number_format($acc_price).'.00</td>
				</tr>';
		}	
		
		if($services['total_price'] > 0){
			$s_no = $s_no + 1;
			$services_html = '<tr>				
					<td align="center">'.$s_no.'</td>
					<td>Other Services Price</td>
					<td align="right">'.$pdf_config['inr_symbol'].number_format($services['total_price']).'.00</td>
				</tr>';
		}	
		if(isset($quote_details['rules']) && $quote_details['rules']->discount->installation_cost != 'no'){
			$s_no = $s_no + 1;
			$ret_installation = '<tr>				
							<td align="center">'.$s_no.'</td>
							<td>Installation</td>
							<td align="right">'.$pdf_config['inr_symbol'].number_format($installation_price).'.00</td>
						</tr>';	
		}				
					
		$grand_total .= '<tr>
						<td colspan="2" align="right" class="color_orange">Grand Total:</td>
						<td align="right">'.$pdf_config['inr_symbol'].number_format($total).'.00</td>
					</tr>
					<tr>
						<td colspan="3" align="right" class="textupper">'.$this->number_to_word($total).'</td>
					</tr>';		
		if($return == 'pdf'){
			return $cabinet_price.$cabinet_discount.$accessories_price.$accessories_discount.$ret_installation.$services_html.$grand_total;
		}else{
			$data['acc_price'] = $acc_price;
			$data['acc_discount'] = $acc_discount;
			$data['cab_price'] = $cab_price;
			$data['cab_discount'] = $cab_discount;
			$data['installation_price'] = $installation_price;
			$data['total'] = $total;
			return $data;
		}		
	}
	
	public function number_to_word($number){
	   $no = round($number);
	   $point = round($number - $no, 2) * 100;
	   $hundred = null;
	   $digits_1 = strlen($no);
	   $i = 0;
	   $str = array();
	   $words = array('0' => '', '1' => 'one', '2' => 'two',
		'3' => 'three', '4' => 'four', '5' => 'five', '6' => 'six',
		'7' => 'seven', '8' => 'eight', '9' => 'nine',
		'10' => 'ten', '11' => 'eleven', '12' => 'twelve',
		'13' => 'thirteen', '14' => 'fourteen',
		'15' => 'fifteen', '16' => 'sixteen', '17' => 'seventeen',
		'18' => 'eighteen', '19' =>'nineteen', '20' => 'twenty',
		'30' => 'thirty', '40' => 'forty', '50' => 'fifty',
		'60' => 'sixty', '70' => 'seventy',
		'80' => 'eighty', '90' => 'ninety');
	   $digits = array('', 'hundred', 'thousand', 'lakh', 'crore');
	   while ($i < $digits_1) {
		 $divider = ($i == 2) ? 10 : 100;
		 $number = floor($no % $divider);
		 $no = floor($no / $divider);
		 $i += ($divider == 10) ? 1 : 2;
		 if ($number) {
			$plural = (($counter = count($str)) && $number > 9) ? 's' : null;
			$hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
			$str [] = ($number < 21) ? $words[$number] .
				" " . $digits[$counter] . $plural . " " . $hundred
				:
				$words[floor($number / 10) * 10]
				. " " . $words[$number % 10] . " "
				. $digits[$counter] . $plural . " " . $hundred;
		 } else $str[] = null;
	  }
	  $str = array_reverse($str);
	  $result = implode('', $str);
	  $points = ($point) ?
		"." . $words[abs($point / 10)] . " " . 
			  $words[abs($point = $point % 10)] : '';
	  $return = '-';
	  if($result != ''){
		  $return = $result . "Rupees  ";
	  }		  
			  
	  return $return;
	}	

}

