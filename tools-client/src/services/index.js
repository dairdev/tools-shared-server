const config = {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	cache: "default"
};

const api = "http://localhost:8000/index.php";

const getConnections = function() {
	//return fetch("api.asmx/cn", config);
	var json = [
		"mclaFinWeb",
		"mclaIntranet"
	];
	return JSON.stringify(json);
};

const getDatabases = function(connection) {
	/*config.body = JSON.stringify({ connectionName: connection });
	return fetch("api.asmx/db", config);*/

	var json = [
		"table 1",
		"table 2",
		"table 3",
	];
	return JSON.stringify(json);
};

const getObjects = function(connection, database) {
	/*
	config.body = JSON.stringify({
		connectionName: connection,
		databaseName: database
	});
	return fetch("api.asmx/sch", config);
	*/
	var json = {
		"tables": [
			{
				'Table 1': [
					{ Name: 'Column 1', Type: 'varchar', Length: 10 },
					{ Name: 'Column 2', Type: 'int', length: 0 },
					{ Name: 'Column 3', Type: 'text', length: 0 },
				],
			},
			{

				'Table 2': [
					{ Name: 'xColumn 1', Type: 'int', Length: 0 },
					{ Name: 'xColumn 2', Type: 'nvarchar', Length: 10 },
					{ Name: 'xColumn 3', Type: 'datetime', Length: 0 },
				]
			}
		],
		"procedures": [
			{
				'Procedure 1': [
					{ Name: 'Column 1', Type: 'varchar', Length: 10 },
					{ Name: 'Column 2', Type: 'int', length: 0 },
					{ Name: 'Column 3', Type: 'text', length: 0 },
				],
			},
			{

				'Procedure 2': [
					{ Name: 'xColumn 1', Type: 'int', Length: 0 },
					{ Name: 'xColumn 2', Type: 'nvarchar', Length: 10 },
					{ Name: 'xColumn 3', Type: 'datetime', Length: 0 },
				]
			}
		],
		"views": [
			{
				'View 1': [
					{ Name: 'Column 1', Type: 'varchar', Length: 10 },
					{ Name: 'Column 2', Type: 'int', length: 0 },
					{ Name: 'Column 3', Type: 'text', length: 0 },
				],
			},
			{
				'View 2': [
					{ Name: 'xColumn 1', Type: 'int', Length: 0 },
					{ Name: 'xColumn 2', Type: 'nvarchar', Length: 10 },
					{ Name: 'xColumn 3', Type: 'datetime', Length: 0 },
				]
			}
		]
	};
	return JSON.stringify(json);
};

const executeQuery = function(connection, database, query) {
	config.body = JSON.stringify({
		connectionName: connection,
		databaseName: database,
		query: query
	});
	return fetch("api.asmx/eq", config);
};

const listFiles = function(url) {
	config.body = JSON.stringify({ url: url.replace("/browser", "") });
	return fetch(api + "/ld", config);
};

export { getConnections, getDatabases, getObjects, executeQuery, listFiles };
