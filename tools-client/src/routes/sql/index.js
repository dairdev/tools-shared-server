import { Component, h } from "preact";

import WindowStates from "../../components/sql/windowStates";
import Appbar from "../../components/appbar";
import Alert from "../../components/alert";
import DBExplorer from "../../components/sql/dbexplorer";
import Editor from "../../components/sql/editor";
import Data from "../../components/sql/data";
import Logs from "../../components/sql/logs";
import { executeQuery } from "../../services";

const jsonWorker = new Worker("Scripts/tools/csvTojsonWorker.js");

var cache = [];

class Sql extends Component {
	constructor() {
		super();
		this.state = {
			showAlert: false,
			isExplorerVisible: true,
			editorState: WindowStates.NORMAL,
			dataState: WindowStates.NORMAL,
			logsState: WindowStates.NORMAL,
			connection: "",
			database: "",
			data: {
				Table: [{ Data: "There is no data" }],
			},
			finished: true,
			messages: null,
		};
	}

	setConnections = (connection, database) => {
		this.setState((state) => ({
			connection: connection,
			database: database,
		}));
	};

	setNewState(oldstate) {
		let state;
		switch (oldstate) {
			case WindowStates.NORMAL:
				state = WindowStates.MAXIMIZED;
				break;
			case WindowStates.MINIMIZED:
				state = WindowStates.NORMAL;
				break;
			case WindowStates.MAXIMIZED:
				state = WindowStates.NORMAL;
				break;
		}

		return state;
	}

	onClickEditorState = (e) => {
		let oldstate = this.state.editorState;

		let state = this.setNewState(oldstate);

		if (oldstate !== state) {
			this.setState({
				editorState: state,
				dataState:
					state === WindowStates.MAXIMIZED
						? WindowStates.MINIMIZED
						: WindowStates.NORMAL,
				logsState:
					state === WindowStates.MAXIMIZED
						? WindowStates.MINIMIZED
						: WindowStates.NORMAL,
			});
		}
	};

	onClickDataState = (e) => {
		let oldstate = this.state.dataState;

		let state = this.setNewState(oldstate);

		if (oldstate !== state) {
			this.setState({
				dataState: state,
				editorState:
					state === WindowStates.MAXIMIZED
						? WindowStates.MINIMIZED
						: WindowStates.NORMAL,
				logsState:
					state === WindowStates.MAXIMIZED
						? WindowStates.MINIMIZED
						: WindowStates.NORMAL,
			});
		}
	};

	onClickLogState = (e) => {
		let oldstate = this.state.logsState;

		let state =
			oldstate === WindowStates.NORMAL
				? WindowStates.MINIMIZED
				: WindowStates.NORMAL;

		if (oldstate !== state) {
			this.setState({
				logsState: state,
			});
		}
	};

	onNavButtonClick = (e) => {
		this.setState({
			isExplorerVisible: !this.state.isExplorerVisible,
		});
	};

	refrehsPage = (e) => {
		location.reload();
	};

	executeQuery = (e) => {
		let self = this;
		executeQuery(
			this.state.connection,
			this.state.database,
			cm.getValue()
		)
			.then((res) => res.text())
			.then(function (text) {
				jsonWorker.postMessage(text);
				jsonWorker.onmessage = function (e) {
					let json = e.data;
					cache = json.table;
					self.setState(function (
						prevState,
						props
					) {
						return {
							data: {
								Table:
									json.table,
							},
							messages: json.messages,
							finished: true,
						};
					});
				};
			});
	};

	onFilterInput = (e) => {
		var self = this;
		var text = e.target.value;
		if (text) {
			var data = cache;
			var aux = data.filter(function (record) {
				var keys = Object.keys(record);
				for (var k in keys) {
					var field = record[keys[k]];
					if (
						field &&
						field.toString().indexOf(text) >
							-1
					) {
						return true;
					}
				}
			});
			//Debouncing
			window.setTimeout(function () {
				self.setState(function (prevState, props) {
					return {
						data: { Table: aux },
						finished: true,
					};
				});
			}, 500);
		} else {
			window.setTimeout(function () {
				self.setState(function (prevState, props) {
					return {
						data: { Table: cache },
						finished: true,
					};
				});
			}, 500);
		}
	};

	render(props, state) {
		return (
			<div id="sql" class="flex-row">
				<Alert
					title="Session Lost"
					content="Your session has been lost"
					type="refresh"
					isOpen={this.state.showAlert}
					onClickButton={this.refrehsPage}
				/>
				<DBExplorer
					isVisible={state.isExplorerVisible}
					setConnections={this.setConnections}
				/>
				<div id="sql-workspace">
					<Appbar
						title="SQL"
						onNavButtonClick={
							this.onNavButtonClick
						}
					>
						<div id="appbar-actions-buttons">
							<button
								type="button"
								onClick={
									this
										.executeQuery
								}
							>
								<i className="fa fa-play-circle"></i>{" "}
								Execute
							</button>
						</div>
					</Appbar>
					<Editor
						windowState={state.editorState}
						onClickEditorState={
							this.onClickEditorState
						}
					/>
					<Data
						windowState={state.dataState}
						onClickDataState={
							this.onClickDataState
						}
						onFilterInput={
							this.onFilterInput
						}
						records={state.data.Table}
					/>
					<Logs
						windowState={state.logsState}
						messages={state.messages}
						onClickLogState={
							this.onClickLogState
						}
					/>
				</div>
			</div>
		);
	}
}

export default Sql;
