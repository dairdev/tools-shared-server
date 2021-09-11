import { Component, h, render } from "preact";
import { useState, useEffect } from "preact/hooks";

import { listFiles } from "../../services";

import Sidenav from "../../components/browser/sidenav";
import Appbar from "../../components/appbar";
import Header from "../../components/browser/header";
import FileList from "../../components/browser/filelist";
import SidePanel from "../../components/browser/sidepanel";

var localCache;
var oldLocation = "";

function Browser(location) {
	const [isLoading, setIsLoading] = useState(true);
	const [file, setFile] = useState(null);
	const [files, setFiles] = useState([]);
	const [filesSelected, setFilesSelected] = useState(null);

	if (oldLocation != location.url) {
		oldLocation = location.url;
		listFiles(location.url)
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
				let json = (data.d) ? JSON.parse(data.d) : data;
				localCache = json;
				setFiles(json);
				setIsLoading(false);
				localStorage.setItem(
					"support_tools_browser",
					data.d
				);
			});
	}

	function onChangeInputFilter(e) {
		console.log(e.target.value);
		let filterWord = e.target.value;
		if (filterWord.length == 0) {
			setFiles(localCache);
			return;
		}
		let filteredList = localCache.filter((record) => {
			return (
				record.name
					.toLowerCase()
					.indexOf(filterWord.toLowerCase()) > -1
			);
		});
		setFiles(filteredList);
	}

	return (
		<div id="browser" className="flex-row">
			<Sidenav />
			<div id="browser-workspace">
				<Appbar title="Browser">
					<div id="appbar-actions-buttons">
						<button type="button">
							<i className="fa fa-upload"></i>{" "}
							Upload
						</button>
					</div>
				</Appbar>
				<div id="browser-body" class="flex-columns">
					<Header
						path={location.url}
						onFilterInput={
							onChangeInputFilter
						}
					/>
					<FileList files={files} />
				</div>
			</div>
		</div>
	);
}

export default Browser;
