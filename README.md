# proyecto3 - Delilah Resto API Backend

1. BASE DE DATOS
	Para crear base de datos y estructura importar a MariaDB archivo database.sql.
		Ej: mysql -h HOST -u USER -p < database.sql
	
	Si desea llenar la base de datos con ejemplos, hay un archivo demodata.sql que se puede importar.
		Ej: mysql -h HOST -u USER -p < demodata.sql

2. VARIABLES
	Definir las variables de entorno, para configuración del servidor y de la base de datos. Usar archivo .env.sample de base y renombrar a .env.
	- Configurar variables de node server:
			NODE_ENV= development
			HOST= 127.0.0.1
			PORT= 3000
	- Configurar variables de MariaDB server:
			DB_HOST= 127.0.0.1
			DB_PORT= 3306
			DB_USER= root
			DB_PASS= password
			DB_DIALECT = mariadb
			DB_DATABASE = delilah
	- Cambiar la variable JWT_KEY !

3. Instalar DEPENDENCIAS del proyecto: 
	npm install

4. INICIAR
	Iniciar el servidor con el archivo server.js
		Ej: node server.js

5. Usuarios y contraseñas.
	La base de datos se crea con un usuario admin default: {"username": "admin","password": "delilah"}.
	Por favor utilice el Endpoint /user[PUT] para completar la informacion y cambiar la contraseña.

6. Se entrega Postman Collection para importar: Proyecto_3.postman.json
