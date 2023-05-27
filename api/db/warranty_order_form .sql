CREATE TABLE `warranty_order_form` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_address` text NOT NULL,
  `customer_city` varchar(50) NOT NULL,
  `customer_postalcode` varchar(20) NOT NULL,
  `customer_email` varchar(50) NOT NULL,
  `customer_order` varchar(100) NOT NULL,
  `customer_dateoforder` date NOT NULL,
  `customer_lowesstore` varchar(50) NOT NULL,
  `customer_doorname` varchar(50) NOT NULL,
  `customer_detail` text NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '0=inactive, 1=active, 2=delete'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `warranty_order_form`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `warranty_order_form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;