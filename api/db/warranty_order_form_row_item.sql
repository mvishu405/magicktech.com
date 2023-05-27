

CREATE TABLE `warranty_order_form_row_item` (
  `id` int(11) NOT NULL,
  `warranty_order_form_id` int(11) NOT NULL,
  `cabinet_qty` int(11) NOT NULL,
  `type_of_item` varchar(250) NOT NULL,
  `which_item_required` varchar(250) NOT NULL,
  `item_position` varchar(100) NOT NULL,
  `office_use` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '0=inactive, 1=active, 2=delete'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `warranty_order_form_row_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warranty_order_form_id` (`warranty_order_form_id`);

ALTER TABLE `warranty_order_form_row_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `warranty_order_form_row_item`
  ADD CONSTRAINT `warranty_order_form_row_item_ibfk_1` FOREIGN KEY (`warranty_order_form_id`) REFERENCES `warranty_order_form` (`id`);
COMMIT;
