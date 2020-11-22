-- Dumping data for table delilah.orders: ~2 rows (approximately)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `user_id`, `payment`, `status`, `delivery_address`, `created_at`) VALUES
	(1, 6, 'cash', 'new', '159 Borinquen Pl, Dupuyer, 3870', '2020-11-22 14:55:51'),
	(3, 2, 'card', 'new', '34 Summer Str, Atlantida, Earth', '2020-11-22 15:14:10');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Dumping data for table delilah.order_items: ~6 rows (approximately)
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `price`, `quantity`, `name`, `image_url`) VALUES
	(1, 1, 1, 700, 2, 'Milanesa sola', 'https://images.deliveryhero.io/image/pedidosya/products/0731e840-731b-4e89-ac4f-0de30ebdbfcb.jpg?quality=80&width=200&height=150'),
	(2, 1, 5, 100, 1, 'Coca-cola lata 354mm', ''),
	(3, 1, 6, 100, 1, 'Fanta lata 354mm', ''),
	(7, 3, 2, 530, 1, 'Pollo al verdeo con papas noissete', 'https://images.deliveryhero.io/image/pedidosya/products/d72765df-80e4-405a-9d35-05ca6f582c86.jpg?quality=80&width=200&height=150'),
	(8, 3, 3, 930, 1, 'Milanesa con papas fritas', 'https://images.deliveryhero.io/image/pedidosya/products/117cfc94-6514-4032-9649-b7a24e8d7c45.jpg?quality=80&width=500'),
	(9, 3, 7, 100, 2, 'Sprite lata 354mm', '');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;

-- Dumping data for table delilah.products: ~8 rows (approximately)
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `name`, `image_url`, `price`) VALUES
	(1, 'Milanesa sola', 'https://images.deliveryhero.io/image/pedidosya/products/0731e840-731b-4e89-ac4f-0de30ebdbfcb.jpg?quality=80&width=200&height=150', 700),
	(2, 'Pollo al verdeo con papas noissete', 'https://images.deliveryhero.io/image/pedidosya/products/d72765df-80e4-405a-9d35-05ca6f582c86.jpg?quality=80&width=200&height=150', 530),
	(3, 'Milanesa con papas fritas', 'https://images.deliveryhero.io/image/pedidosya/products/117cfc94-6514-4032-9649-b7a24e8d7c45.jpg?quality=80&width=500', 930),
	(4, 'Tortilla de papa', 'https://images.deliveryhero.io/image/pedidosya/products/934573f8-a5e8-4f53-89cc-36eee14a4c4f.jpg?quality=80&width=200&height=150', 330),
	(5, 'Coca-cola lata 354mm', '', 100),
	(6, 'Fanta lata 354mm', '', 100),
	(7, 'Sprite lata 354mm', '', 100),
	(8, 'Agua sin gas 500mm', '', 100);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

-- Dumping data for table delilah.users: ~6 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `email`, `name`, `lastname`, `phone`, `address`, `admin`, `password`) VALUES
	(1, 'admin', '', '', '', '', '', 1, 'delilah'),
	(2, 'johnnybgood', 'johnny.good@email.com', 'Johnny', 'Good', '+456 555-1234', '34 Summer Str, Atlantida, Earth', 0, 'password'),
	(3, 'adipisicing615', 'olagarza@sonique.com', 'Ola', 'Garza', '(836) 435-2058', '761 Perry Place, Russellville, 1369', 0, '595dolore269'),
	(4, 'mollit986', 'debrarivera@sonique.com', 'Debra', 'Rivera', '(889) 405-2448', '838 Brooklyn Avenue, Bend, 3654', 0, '528elit374'),
	(5, 'occaecat697', 'lindseyferrell@sonique.com', 'Lindsey', 'Ferrell', '(887) 455-2613', '454 Empire Boulevard, Cobbtown, 420', 0, '248aute915'),
	(6, 'irure135', 'lindagutierrez@sonique.com', 'Linda', 'Gutierrez', '(979) 449-2299', '159 Borinquen Pl, Dupuyer, 3870', 0, '751laborum723');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
