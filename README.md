# proyecto3 - Delilah Resto API Backend

1. BASE DE DATOS
	Para crear estructura de base de datos MariaDB importar archivo database.sql en root.
		Ej: mysql -h HOST -u USER -p < database.sql
	
	Si desea llenar la base de datos con ejemplos, hay un archivo demodata.sql que se puede importar.
		Ej: mysql -h HOST -u USER -p < demodata.sql

2. VARIABLES
	Definir las variables de conexión y configuración. Usar archivo .env.sample de base y renombrar a .env
	Cambiar la variable JWT_KEY !

3. INICIAR
	Iniciar el servidor con el archivo server.js
		Ej: node server.js

4. Usuarios y contraseñas.
	La base de datos se crea con un usuario admin default: {"username": "admin","password": "delilah"}.
	Por favor utilice el Endpoint /user[POST] para completar la informacion y cambiar la contraseña.