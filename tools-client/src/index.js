"use strict";
import "preact/debug";

import { Component, h, render } from "preact";
import { Router, route } from "preact-router";
import { createHashHistory } from "history";

import Sidebar from "./components/sidebar";

import Sql from "./routes/sql";
import Browser from "./routes/browser";

class App extends Component {
	constructor() {
		super();
		this.state = {
			current: "browser",
			url: "/",
		};
	}

	componentDidMount() {
		let location = window.location.href;
		let indexHash = location.indexOf("#");
		let url = location.substr(
			indexHash,
			location.length - indexHash
		);
		//console.log("componentDidMount: " + url);
		let tab = url.indexOf("#/sql") > 0 ? "sql" : "browser";
		this.setState({
			current: tab,
			url: url,
		});
	}

	handleRoute = (e) => {
		e.preventDefault;
		let location = window.location.href;
		let indexHash = location.indexOf("#");
		let url = location.substr(
			indexHash,
			location.length - indexHash
		);
		let tab = url.indexOf("sql") > 0 ? "sql" : "browser";
		this.setState({
			current: tab,
			url: url,
		});
	};

	render() {
		return (
			<div id="app" className="flex-row">
				<Sidebar current={this.state.current} />
				<div id="workspace">
					<Router
						history={createHashHistory()}
						onChange={this.handleRoute}
					>
						<Browser
							path="/browser"
							url={this.state.url}
							default
						/>
						<Sql path="/sql" />
					</Router>
				</div>
			</div>
		);
	}
}

/*
function start() {
window.setTimeout(function () {
	document.querySelector("#loader").classList.add(
		"animated",
		"fadeOut"
	);
}, 2000);
window.setTimeout(function () {
	document.querySelector("#loader").style.display = "none";
	render(h(App), document.querySelector("#content"));
}, 3500);
}

start();
*/
render(h(App), document.body);
