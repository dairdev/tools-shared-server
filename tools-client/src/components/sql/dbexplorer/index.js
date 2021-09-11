import { Component, h } from "preact";

import { getConnections, getDatabases, getObjects } from "../../../services";

import Connection from "../connection";
import FilterExplorer from "../filterexplorer";
import ContentExplorer from "../contentexplorer";

var cache = {};

class DBExplorer extends Component {
	constructor() {
		super();
		this.state = {
			connection: null,
			database: null,
			connections: [],
			databases: [],
			objects: [],
			viewType: "tables",
		};
	}

	componentDidMount() {
		getConnections()
			.then((res) => res.json())
			.then((res) => {
				const data = JSON.parse(res.d);
				this.setState({ connections: data });
			});
	}

	fetchDbObjects = (connection, database) => {
		getObjects(connection, database)
			.then((res) => res.json())
			.then((res) => {
				const data = JSON.parse(res.d);
				this.setState({ objects: data });
				cache = data;
			});
	};

	onChangeConnection = (e) => {
		getDatabases(e.target.value)
			.then((res) => res.json())
			.then((res) => {
				const data = JSON.parse(res.d);
				this.setState({
					connection: e.target.value,
					databases: data,
				});
			});
	};

	onChangeDatabase = (database, callback) => {
		this.setState({ database: database });
		this.fetchDbObjects(this.state.connection, database);
		callback(this.state.connection, database);
	};

	onClickUpdateObjects = (e) => {
		this.fetchDbObjects(this.state.connection, this.state.database);
	};

	onClickFilter = (e) => {
		let type = e.target.value;
		if (e.target.tagName === "I") {
			type = e.target.parentNode.value;
		}
		this.setState({ viewType: type });
	};

	onChangeTextFilter = (e) => {
		if (e.target.value.length > 0) {
			let filtered = cache[this.state.viewType].filter(
				(obj) =>
					Object.keys(obj)[0].indexOf(
						e.target.value
					) > -1
			);
			let tmp = Object.assign({}, cache);
			tmp[this.state.viewType] = filtered;
			this.setState({ objects: tmp });
		} else {
			this.setState({ objects: cache });
		}
	};

	render({ isVisible, setConnections }, state) {
		return (
			<div
				id="sql-explorer"
				className="flex-column"
			>
				<div
					id="sql-explorer-title"
					className="window-title"
				>
					<span>DB Explorer</span>
					<button
						onClick={
							this
								.onClickUpdateObjects
						}
					>
						<i className="fa fa-refresh"></i>
					</button>
				</div>
				<Connection
					connections={state.connections}
					onChangeConnection={
						this.onChangeConnection
					}
					databases={state.databases}
					onChangeDatabase={(e) =>
						this.onChangeDatabase(
							e.target.value,
							setConnections
						)
					}
				/>
				<FilterExplorer
					type={state.viewType}
					onClickFilter={this.onClickFilter}
					onChangeTextFilter={
						this.onChangeTextFilter
					}
				/>
				<ContentExplorer
					type={state.viewType}
					objects={state.objects}
				/>
			</div>
		);
	}
}
export default DBExplorer;
