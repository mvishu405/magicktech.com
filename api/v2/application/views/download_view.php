<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$quote_number = $quote_details['quote_number'];
if($quote_details['quoteforname'] == $customer_details['name']){
	$quote_details['quoteforname'] = '';
}

$athome_dealerid = 21;
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache" />
<title>MagickWoodsQuote_<?php echo $quote_number; ?></title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css">
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
</head>
<style>
.textupper{text-transform:uppercase;}
body{background-image:url('<?php echo base_url(); ?>images/kitchen-pattern.jpg');background-size:30px;font-family: 'Roboto', sans-serif;font-size:13px;padding-right:6px;}
	img{width:100%;max-width:100%;}
	.mw100{max-width:150px;}
	.mw500{max-width:300px;float:right;}
	ul{margin:0;padding:0;}
	ul li{margin:0;list-style:none;    width: 100%;
    float: left;font-weight:bold;}
	.header{border-bottom:none;}
	.fw{width:100%;float:left;}
	.ptb{padding-top:15px;padding-bottom:15px;padding-left:3px;}
	ul li span{width:200px;float:left;font-weight:normal;background: #f9f9f9;padding: 5px 10px;padding-top:0;}
	.border_li ul li{border-bottom:1px solid #f1f1f1;}
	.white{
		color:#fff;
	}
	table{    border: 1px solid #dee2e6;}
	tr {
         page-break-inside: avoid;
      }	
	  .border_li td{border-top:0;}
	  .header{border-bottom:0;}

.bordernone{border:0;}
.bordernone td{border:0;}
.location_list li{    width: auto;
    margin-right: 10px;
    font-size: 12px;
    background: url(<?php echo base_url(); ?>images/arrow.png) no-repeat;
    background-position: 0% 40%;
    margin: 0 15px;
    padding-left: 15px;
    background-size: 9px;}

.list{margin-left: 17px;}
.list li{list-style: circle;margin-right:10px;margin-right: 34px;font-weight:normal;margin-bottom:15px;    line-height: 30px;}

.title{font-size:28px;font-weight:bold;display: inline-block;    border-bottom: 5px solid #F6232B;    padding-bottom: 20px;margin-top:15px;}
table .ptb{padding-top:0;padding-bottom:0;}
.h5_title{border-bottom: 2px solid #F6232B; padding:10px;padding-left:0;padding-right:0;display:inline-block;}
.color_orange{color:#F6232B;}
hr.color_orange{border-color:#F6232B;}
.box_sec img{width:150px;padding: 20px;}
.leftborder{background:url(<?php echo base_url(); ?>images/arrow.png) no-repeat;background-position: 0% 40%;padding-left:18px;text-transform:uppercase;}
.ul_title{width:100%;float:left;margin-bottom:10px;}
	a{text-decoration:none;color:#000;}
.kit_last_sec p{margin-top:15px;}	
.pb_before { page-break-before:always !important; }
.pb_after { page-break-after:always !important; }
.pb_inside { page-break-inside: avoid !important; }
.table td, .table th {
    vertical-align: inherit !important;
}
.pb0{padding-bottom:0 !important;}
a:hover{color:#F6232B;}
.fa-rotate-270 {
    -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg);
}
.tagline{
	    float: left;
    width: 100%;
    font-size: 17px;
    letter-spacing: 6px;
    margin-bottom: 8px;
    margin-top: -6px;
}
.table thead th{
	color: #000 !important;
    font-size: 14px !important;}
.title .f_upper {
    text-transform: capitalize;
}	
</style>

<body>
<div class="bodyin">
<div class="container">
	<div class="row header">
	<table class="table bordernone" >
		<tbody>
			<tr>
				<td colspan="2" align="center"><a href="http://magickwoods.com" target="_blank"><img src="<?php echo base_url(); ?>images/mw_logo_com.png" style="width:400px;margin:60px 0 0 0;" width="400"></a><a href="http://magickwoods.in" class="tagline" target="_blank">magickwoods.in</a></td>
			</tr>
			<tr>
				<td><h2 class="title"><?php if( $type != 'customer'){echo '<span class="f_upper">'.$type.'</span>: ';} ?>Quotation</h2></td><td align="right" valign="center"><p style="font-size: 15px;"><b>Date:</b> 
				<?php echo $date = date('d M Y', strtotime($quote_details['date_modified'])); ?></p></td>
			</tr>
			<tr>
				<td>
					<h5 class="h5_title color_orange">Customer</h5>
					<p>Name: <?php echo ucwords($customer_details['name']); ?></p>
					<?php if($quote_details['quoteforname'] != ''){ ?><p>Project Name: <?php echo ucwords($quote_details['quoteforname']); ?></p><?php } ?>
					<p>Customer ID: <?php echo $customer_details['cid']; ?></p>
					<p>Quote ID: <?php echo $quote_number; ?></p>
				</td>
				<td width="50%">
					<h5 class="h5_title color_orange">Customer Contact Details</h5>
					<p>Phone: <a href="tel:<?php echo $customer_details['phone']; ?>"><?php echo $customer_details['phone']; ?></a></p>
					<p>Email: <a href="mailto:<?php echo $customer_details['email']; ?>"><?php echo $customer_details['email']; ?></a></p>
					<p>Address: <?php echo $customer_details['address']; ?></p>
				</td>				
			</tr>
			<tr>
				<td colspan="">
				<div style="width:100%;float:left;">
				<h5 class="h5_title color_orange" >Dealer</h5>
				</div>
				<div style="width:50%;float:left;padding-top:2%;">
					<img src="http://quote.magickwoods.in/assets/dealerlogo/<?php echo 'dealerlogo_'.$quote_details['dealer_id'].'.png'; ?>" style="max-height:100px;width:auto;">
				</div>
				<div style="width:50%;float:left">
					<p>Name: <?php echo ucwords($dealer_details['user_name']); ?></p>
					<p>Phone: <a href="tel:<?php echo $dealer_details['phone']; ?>"><?php echo $dealer_details['phone']; ?></a></p>
					<p>Email: <a href="mailto:<?php echo $dealer_details['email']; ?>"><?php echo $dealer_details['email']; ?></a></p>
				</div>
				</td>
				<td>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<h5 class="h5_title color_orange">Designer</h5>
					<p>Name: <?php echo $designer_details['name']; ?></p>
					<p>Phone: <a href="tel:<?php echo $designer_details['phone']; ?>"><?php echo $designer_details['phone']; ?></a></p>
					<p>Email: <a href="mailto:<?php echo $designer_details['email']; ?>"><?php echo $designer_details['email']; ?></a></p>
				</td>				
			</tr>			
			<tr><td colspan="2"><i> Quote valid upto: 
			<?php echo $date = date('d M Y', strtotime($quote_details['date_modified']." + 15day")); ?></i></td></tr>			
			<tr>
				
				<td colspan="2">
				<div style="height:150px;"></div>
				<hr class="color_orange">
				<table class="bordernone" width="100%" style="margin:20px 0;background: #fff;border: 16px solid #fff;">
					<tbody>
					<tr align="center" class="box_sec">
						<td><a href="https://magickwoods.in/about/recognitions-certifications/" target="_blank">
							<img src="<?php echo base_url(); ?>images/45days.png"  style="width:135px;" /><p>45 Days Installation Guarantee</p>
							</a>
						</td>					
						<td><a href="https://magickwoods.in/about/recognitions-certifications/" target="_blank">
							<img src="<?php echo base_url(); ?>images/certificate-carb.jpg" /><p>California Air Regulation Board</p>
							</a>
						</td>
						<td><a href="https://magickwoods.in/about/recognitions-certifications/" target="_blank">
							<img src="<?php echo base_url(); ?>images/certificate-fsc.jpg"  /><p>Forest Stewardship Council</p>
							</a>
						</td>
						<td><a href="https://magickwoods.in/about/recognitions-certifications/" target="_blank">
							<img src="<?php echo base_url(); ?>images/warranty.png" /><p>5 Years Warranty</p>
							</a>
						</td>
					</tr>
					</tbody>
				</table>
			</tr>			
			<tr>
				<td align="center" colspan="2"><i>For any queries, requests or complaints, please reach us on our Toll Free Number:<a href="tel:18005723004"> 1800-572-3004  <img src="<?php echo base_url(); ?>images/phone.png" class="fa-rotate-270" style="width:12px;margin-top:-4px;" height="12" /></a></i>
				</td>
			</tr>			
		</tbody>		
	</table>
    <div class="col-md-12"><hr class="color_orange"></div>
	<table class="table bordernone pb_before" style="margin-bottom:0;">
		<tbody>
			<tr><td><h2 class="title">Kitchen</h2></td></tr>
			<tr><td class="pb0"><h6 class="leftborder">Cabinet List</h6></td></tr>
		</tbody>
	</table>
	</div>
	<div class="row ptb">
		<div class="col-md-12">
		<table class="table" style="background:#fff;">
		<thead class="color_orange">
		  <tr>
			<th>S.No</th>
			<th>Cabinet Code</th>
			<th>Carcass</th>
			<th>Shutter</th>
			<th>Hinges</th>
			<th>Drawers</th>
			<th>Handles</th>
			<th>Flap up</th>
			<th <?php echo ( $quote_details['show_cabinetprice'] == 0 )?'style="text-align: center;"':'';?>>Qty</th>
			<?php if( $quote_details['show_cabinetprice'] == 1 ) { ?>
			<th class="text-right" class="text-right" width="100">Price</th> 
			<?php } ?>
		  </tr>
		</thead>
		<tbody>
			<?php echo $cabinet_list; ?>
		</tbody>
		</table>
		</div>
	</div>
	<div class="row ptb pb_before">
		<table class="table bordernone" >
			<tbody>
				<tr><td class="pb0"><h6 class="leftborder">Accessories List</h6></td></tr>
			</tbody>
		</table>	
		<div class="col-md-12">
		<table class="table" style="background:#fff;">	
			<?php echo $accessories_list; ?>
		</table>
		</div>
	<?php if($installation != ''){ ?>
	<div class="fw ptb">	
		<table class="table bordernone" >
			<tbody>
				<tr><td class="pb0"><h6 class="leftborder">Installation</h6></td></tr>
			</tbody>
		</table>	
		<div class="col-md-12">
		<table class="table" style="background:#fff;">
		<thead class="color_orange">
		  <tr>
			<th width="30">S.No</th>
			<th>Details</th>
			<th width="100" class="text-right">Price</th>
		  </tr>
		</thead>
		<tbody>
			<?php echo $installation; ?>
		</tbody>
		</table>
		</div>
	</div>
	<?php } if(count($services['array']) > 0){ ?>
	<div class="fw ptb">	
		<table class="table bordernone" >
			<tbody>
				<tr><td class="pb0"><h6 class="leftborder">Other Services</h6></td></tr>
			</tbody>
		</table>	
		<div class="col-md-12">
		<table class="table" style="background:#fff;">
		<thead class="color_orange">
		  <tr>
			<th width="30">S.No</th>
			<th>Service Name</th>
			<th width="100" class="text-right">Price</th>
		  </tr>
		</thead>
		<tbody>
			<?php echo $services['html'] ?>
		</tbody>
		</table>
		</div>
	</div>
	<?php } ?>
	<div class="fw ptb">	
		<table class="table bordernone" >
			<tbody>
				<tr><td class="pb0"><h6 class="leftborder">Summary</h6></td></tr>
			</tbody>
		</table>	
		<div class="col-md-12">
		<table class="table" style="background:#fff;">
		<thead class="color_orange">
		  <tr>
			<th width="30">S.No</th>
			<th>Description</th>
			<th width="120" class="text-right">Price</th>
		  </tr>
		</thead>
		<tbody>
			<?php echo $summary; ?>
		</tbody>
		</table>
		</div>
	</div>	
	
	<?php 
	
	echo get_notes($quote_details, $athome_dealerid); 
	?>

	<div class="row ptb pb_before">
		<table class="table bordernone" >
			<tbody>
				<tr><td class="pb0"><h6 class="leftborder">Terms And Conditions</h6></td></tr>
			</tbody>
		</table>	
		<div class="col-md-12">
		<table class="table" style="background:#fff;">
		<tbody>
			<tr>
				<td>
					<?php 
					echo getterms_payment();					
					echo getterms_completionduration();
					echo getterms_validity();
					echo getterms_commercial();					
					echo getterms_others();
					?>
				</td>
			</tr>
		</tbody>
		</table>
		</div>

		<div class="col-md-12">
		    <div style="height:200px;"></div>
			<table class="table bordernone kit_last_sec" style="background:#fff;margin:50px 0 30px 0;background:#fff;border: 25px solid #fff;">
				<tbody>
				<tr align="center">
					<td width="25%"><a href="https://magickwoods.in/about/magickwoods-difference/" target="_blank"><img src="<?php echo base_url(); ?>images/MagickWoods_Difference_kitchen1.jpg" width="250" height="110" /><p>Incomparable standards</p></a></td>
					<td width="25%"><a href="https://magickwoods.in/about/magickwoods-difference/" target="_blank"><img src="<?php echo base_url(); ?>images/MagickWoods_Difference_kitchen2.jpg" width="250" height="110" /><p>The latest trends</p></a></td>
					<td width="25%"><a href="https://magickwoods.in/about/magickwoods-difference/" target="_blank"><img src="<?php echo base_url(); ?>images/MagickWoods_Difference_kitchen3.jpg" width="250" height="110" /><p>Unparalleled craftsmanship</p></a></td>
					<td width="25%"><a href="https://magickwoods.in/about/magickwoods-difference/" target="_blank"><img src="<?php echo base_url(); ?>images/MagickWoods_Difference_kitchen4.jpg" width="250" height="110" /><p>Simplicity at its best</p></a></td>
				</tr>
				</tbody>
			</table>
		</div>
		<div class="col-md-12 text-center" style="margin:50px 0;"><h2>Thank You!</h2><p><i>The end of the Quote.</i><p>
		</div>
	</div>
</div><!---container-->
</div>
</body>
</html>

<?php

function get_notes($quote_details, $athome_dealerid) {
	
	if($quote_details['dealer_id'] == $athome_dealerid) {
		return;
	}
	else {
		return '<div class="fw ptb"><table class="table bordernone" ><tbody><tr><td class="pb0"><h6 class="leftborder">Notes</h6></td></tr></tbody></table><div class="col-md-12"><table class="table" style="background:#fff;"><thead class="color_orange"><tr><th width="30">S.No</th><th>Details </th></tr></thead><tbody><tr><td align="center">1</td><td>Appliances - Clients scope.</td></tr><tr><td align="center">2</td><td>Worktop - Clients scope.</td></tr></tbody></table></div></div></div>';
	}
}

function getterms_payment() {
	global $quote_details, $athome_dealerid;
	
	if($quote_details['dealer_id'] == $athome_dealerid) {
		return '<span class="color_orange ul_title">Payment:</span><ul class="list"><li>10% on Advance</li><li>40% on Design Sign Off</li><li>50% on material ready for dispatch</li><li>The price inclusive of 18% GST</li></ul>';
	}
	else {
		return '<span class="color_orange ul_title">Payment:</span><ul class="list"><li>70% advance against confirmed P.O / approved Quotation and balance 30% before despatch of materials. Services /materials other than quoted shall be charged at seperately Necessary water/electricity and other required services to be provided free of cost at site of work.</li><li>Proper storage of materials and tools to be provided at site. Approval of estimates, designs and colour to be has to be provided before commencement of work.</li><li>The price inclusive of 18% GST</li></ul>';
	}
}

function getterms_completionduration() {
	global $quote_details, $athome_dealerid;
	
	if($quote_details['dealer_id'] == $athome_dealerid) {
		return '<span class="color_orange ul_title">Completion Duration:</span><ul class="list"><li>We keep time. Get all your ordered Modular kitchen within 45 days.</li></ul>';
	}
	else {
		return '<span class="color_orange ul_title">Completion Duration:</span><ul class="list"><li> 5 - 7 weeks from the date of confirmed P.O/advance /colour confirmation Completion of project is subject to site availabilty and incase of any delay in handing of by the client/architect/consultant, finished products can be inspected at the factory and balance payment to be released. Ware house charges shall be applicable incase the client wants the finished products to be stored at our end.</li></ul>';
	}
}

function getterms_validity() {
	global $quote_details, $athome_dealerid;
	
	return '<span class="color_orange ul_title">Validity:</span><ul class="list"><li>Quotaion Validity: 30 days from the date of submission</li><li>Final offer Validity: 7 days from the date of offer finalisation</li></ul>';
}
	
function getterms_commercial() {
	global $quote_details, $athome_dealerid;
	
	if($quote_details['dealer_id'] == $athome_dealerid) {
		return;
	}
	else {
		return '<span class="color_orange ul_title">Commercial:</span><ul class="list"><li>All rates quoted are inclusive of all duties and taxes</li><li>Installation charges included <sup>*</sup></li><li>Freight / Transportation charges included <sup>*</sup></li></ul>';
	}
}

function getterms_others() {
	global $quote_details, $athome_dealerid;
	
	if($quote_details['dealer_id'] == $athome_dealerid) {
		return '<span class="color_orange ul_title">Others:</span><ul class="list"><li>Plumbing, Counter top, Gas piping, Appliances, Hob, Chimney, Sink, Taps, Electrical shifting, Tile laying, Core cutting and civil changes are not considered in this quote. These items are quoted separately if needed.</li></ul>';
	}
	else {
		return '<span class="color_orange ul_title">Others:</span><ul class="list"><li>Granite / Gas Hob / Sink / Chimney and other related appliances not in our scope.</li><li>Civil / Plumbing, Sanitary works not in our scope.</li><li>Electrial / Electrial fitting not in our scope, untill & unless quoted for.</li></ul>';
	}
}
?>
