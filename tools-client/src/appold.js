"use strict";
const { h, Component, render } = preact; /** @jsx h */
const { Router, route } = preactRouter;
const { createHashHistory } = History;
import config from './config.js';
import Loader from './lineloader.js';
import FileControls from './filescontrols.js';
import Sql from './sql.js';

const textExtensions = ".asa.asax.asmx.asp.aspx.bat.cs.css.csv.config.inc.htm.html.java.js.log.vb.vbs.txt.xml";

var t = 0;
var localCache = [];

class App extends Component {

	constructor(){
		super();
		this.handleRoute = this.handleRoute.bind(this);
		this.setState({
			sessionLost: false,
			isAutorized: true
		});
	}

	componentDidMount(){
		//this.validateSession();
		//this.testFixesWMI();
	}

	testFixesWMI(){
		fetch("api.asmx/TestHotFixesWMI", config);
	}

	handleRoute(e) {
		e.preventDefault;
		let location = window.location.href;
		let url = location.substr(1, location.length);
		let tab = ( url.indexOf("sql") > 0  ? 'sql' : 'browser' );
		this.setState({
			currentTab: tab,
			url: url
		});
	}

	viewServerVersion(){
		fetch("api.asmx/vsv", config)
			.then(function(res){
				return res.json();
			}).then(function(data){
				console.log(data);
			});
	}

	validateSession(){
		let self = this;
		fetch("api.asmx/vs", config)
			.then(function(res){
				return res.json();
			}).then(function(data){
				let json = JSON.parse(data.d);
				self.setState(function(prevState, props){
					return {
						isAutorized: (json.result === 'True' )
					}
				});
			});
	}


	/*
	testSession(){
		let self = this;
		const xhr = new XMLHttpRequest();

		xhr.onload = function(e) {
			try{
				let sessionLost = false;

				if(xhr.status === 200){
					const response = JSON.parse(xhr.responseText);
					const json = JSON.parse(response.d);
					if(!json || json.result === false || json.result === "False"){
						sessionLost= true;
					}
				}else{
					sessionLost = false;
				}

				self.setState(function(prevState, props){
					return {
						sessionLost: sessionLost
					}
				});

			}catch(ex){
				console.log(ex);
			}
		};

		xhr.open("POST", "wsStudio.asmx/ValidateSession", true);
		xhr.setRequestHeader('Accept','application/json');
		xhr.setRequestHeader('Content-Type','application/json');
		xhr.send();
	}
	*/

	render(props, state) {
		return (
			<div id="app">
				<SessionMessage sessionLost={ state.sessionLost } />
				<SideNav currentTab = { state.currentTab } />
				<div id="app-content">
					{
						<Router history={createHashHistory()} onChange={ this.handleRoute } >
							<Browser
								path="/browser"
								default
								url = { state.url }
							></Browser>
							<Sql
								path="/sql"
								url = { state.url }
							></Sql>
						</Router>
					}
				</div>
			</div>
		);
	}
};

const NoAccess = function(props){
	return (
		<div class="full-page-wrapper">
			<div id="sessionMessage">
				<h1 style="color: red;">You have no access</h1>
			</div>
		</div>
	);
};

class SessionMessage extends Component {
	constructor(){
		super();
		this.reload = this.reload.bind(this);
	}

	reload(e){
		e.preventDefault();
		window.location.reload(true);
	}

	render(props, state){
		return (
			<div className={ "full-page-wrapper " + ( props.sessionLost ? '' : 'hide') }>
				<div id="sessionMessage">
					<button id="btn-reload" onclick={ this.reload } >
						Session Lost <br />
						<i class="fa fa-refresh"></i>
						Reload
					</button>
				</div>
			</div>
		);
	}
}

const SideNav = function(props) {
	return(
		<div id="sideNav">
			<a href="#/browser/" class={ (props.currentTab === "browser") ? "active" : "" } >
				<i class="fa fa-globe"></i>
			</a>
			<a href="#/sql/" class= { (props.currentTab === "sql") ? "active" : "" }>
				<i class="fa fa-server"></i>
			</a>
		</div>
	);
};

class Browser extends Component {

	constructor(){
		super();
		//Callbacks
		this.filter = this.filter.bind(this);
		this.closePreview = this.closePreview.bind(this);
		this.sort = this.onSort.bind(this);
		this.openPreview = this.openPreview.bind(this);

		this.upload =  this.upload.bind(this);
		this.onInputChange =  this.onInputChange.bind(this);
		this.onSelectFile =  this.onSelectFile.bind(this);
		this.onCancelUpload = this.onCancelUpload.bind(this);
		this.onDownloadFile = this.onDownloadFile.bind(this);

		this.onOpenCreateFolder = this.onOpenCreateFolder.bind(this);
		this.onCreateFolder = this.onCreateFolder.bind(this);
		this.onInputNewFolderChange = this.onInputNewFolderChange.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onRename = this.onRename.bind(this);

		this.cm = null;
		this.filesSelected = [];
		this.sortOrder = -1;
		this.setState({ url:  "/", file: null, isLoading: true, txtNewNameCls: 'hide', isNewFolderActive: false });
	}

	componentDidMount(){
		this.readKeysTLS12();
	}

	componentWillReceiveProps(props){
		if( props.url.indexOf(".") > -1 ){
			this.viewFile(props.url);
		}else{
			this.listFiles(props.url);
		}
	}

	componentDidUpdate(){
		this.setEditor();
	}

	readKeysTLS12(){
		fetch("api.asmx/rk", config)
			.then(function(res){
				return res.json()
			}).then(function(data){
				let result = JSON.parse(data.d);
				console.log(result)
			});
	}

	setEditor(){
		if( this.state.file && this.state.file.isText ){
			let mode = this.getMode();
			if( this.cm === null ){
				let elm = document.getElementById("txtContent");
				this.cm = CodeMirror.fromTextArea( elm, {
					mode: mode,
					lineNumbers: true,
					indentUnit: 4,
					indentWithTabs: true,
					readOnly: true
				});
			}else{
				this.cm.setOption("mode", mode);
			}
			document.querySelector(".CodeMirror").classList.remove("hide");
			this.cm.setValue(this.state.file.content);
			this.cm.refresh();
		}else{
			if ( this.cm ){
				document.querySelector(".CodeMirror").classList.add("hide");
			}
		}
	}

	getMode(){
		let mode;
		switch(this.state.file.extension){
			case '.asmx':
				mode = 'application/xml';
				break;
			case '.asp':
				mode = 'application/x-aspx';
				break;
			case '.aspx':
				mode = 'application/xml';
				break;
			case '.css':
				mode = 'text/css';
				break;
			case '.config':
				mode = 'application/xml';
				break;
			case '.htm':
				mode= 'text/html';
				break;
			case '.html':
				mode= 'application/x-ejs';
				break;
			case '.js':
				mode= 'javascript';
				break;
			case '.vb':
				mode= 'text/x-vb';
				break;
			case '.xml':
				mode = 'application/xml';
				break;
			default:
				mode = 'text';
				break;
		}
		return mode;
	}

	showLoader(){
		this.setState(function(prevState, props){
			return {
				isLoading: true
			}
		});
	}

	unCheck(){
		let checksSelected = document.querySelectorAll("input[type=checkbox]:checked");
		let checksCount = checksSelected.length;
		let i = checksCount;
		while(i--){
			let check = checksSelected[i];
			check.setAttribute("checked", false);
			check.click();
		}
	}

	listFiles(url){
		this.showLoader();
		this.unCheck();
		var self = this;
		var aux = url.replace('/browser', '');
		config.body = JSON.stringify({ url:  aux});
		fetch("api.asmx/ld", config)
			.then(function(res){
				return res.json()
			}).then(function(data){
				let json = JSON.parse(data.d);
				localCache = json;
				self.setState({
					files: json,
					fileCount: json.length,
					url: aux,
					file: null,
					isLoading: false,
					filesSelected: null
				});
				localStorage.setItem("support_tools_browser", data.d);
			});
	}

	viewFile(url){
		this.showLoader();
		var self = this;
		var aux = url.replace('#/browser', '');
		config.body = JSON.stringify({ url: aux });
		fetch("api.asmx/vf", config)
			.then(function(res){
				return res.json()
			}).then(function(data){
				let json = JSON.parse(data.d);
				let localCache = JSON.parse(localStorage.getItem("support_tools_browser"));
				self.setState({
					file: {
						name: json.name,
						size: json.size,
						url: json.url,
						extension: json.extension.toLowerCase(),
						content: json.content,
						isText:(  textExtensions.indexOf(json.extension.toLowerCase()) > -1 ),
					},
					files: localCache,
					fileCount: localCache.length,
					isLoading: false
				});

			});
	}

	filter(e){
		let text = e.target.value.toLowerCase();
		let  tmp = localCache;
		if ( text.length > 0 ){
			tmp = localCache.filter(function(o){
				return (o.name.toLowerCase().indexOf(text) > -1);
			});
		}
		this.setState(function( prevState, props ){
			return {
				files: tmp
			}
		});
	}

	openPreview(e){
		e.preventDefault();
		this.viewFile(e.target.getAttribute("href"));
	}

	closePreview(e){
		this.setState(function( prevState, props) {
			return { file: null };
		});
	}

	upload(e){

		e.preventDefault();

		this.setState(function(prevState, props){
			return { isLoading: true };
		});

		let self = this;
		let formUpload = document.querySelector('#formUpload');
		let input = document.querySelector('input[type="file"]');
		let count = input.files.length;

		for(let i = 0; i < count; i++){

			const xhr = new XMLHttpRequest();
			const f = input.files[i];
			const formData = new FormData();

			formData.append('url', this.state.url);
			formData.append('file' + i, f);

			xhr.onreadystatechange = function(e){
				if(xhr.readyState !== 4  || xhr.status !== 200){
					self.setState( function(prevState, props) {
						return {
							text: "Error",
							icon: "fa fa-times",
							msg: "Your session has been lost",
							disabled: true,
							reload: true
						};
					});
				}
			}

			xhr.onload = function(e) {
				try{

					const json = JSON.parse(xhr.responseText);

					if(xhr.status !== 200 || xhr.readyState !== 4){
						throw "Your session has been lost";
					}

					if(!json || json.result === "False"){
						throw json.msg;
					}

					if( i == count - 1 ){
						self.setState(function(prevState, props) {
							return {
								filesToUpload: null,
								isLoading: false
							}
						});
						self.listFiles(self.state.url);
						formUpload.reset();
					}

				}catch(ex){
					console.error(ex);
					self.setState({ text: "Error", icon: "fa fa-times", msg: json.msg, disabled: true });
				}
			};

			xhr.upload.onprogress = function(e){
				if (e.lengthComputable) {
					//progressCallback(e.loaded / e.total * 100);
				}
			};

			xhr.open("POST", "api.asmx/ul", true);
			//xhr.setRequestHeader("Content-Type","multipart/form-data; boundary=something");
			xhr.send(formData);

		}
	};

	onInputNewFolderChange(e) {
		if(e.keyCode === 27){
			this.setState(function( prevState, props){
				return {
					isNewFolderActive: false
				}
			});
		}
	}

	onInputChange(e){
		e.preventDefault();
		let filesToUpload = [];
		for(let i in e.target.files){
			let f = e.target.files[i];
			if(f && f.size >= 0 ){
				filesToUpload.push(f.name);
			}
		}
		if ( filesToUpload.length === 0 ){
			this.setState({ filesToUpload: null });
			return false;
		}
		this.setState({ filesToUpload: filesToUpload });
	}

	onSort(e){
		let key = "";

		this.sortOrder = -1*this.sortOrder;

		let sortOrder = this.sortOrder;

		switch(e.target.textContent){
			case 'Name':
				key = 'name';
				break;
			case 'Type':
				key = 'extension';
				break;
			case 'Date Modified':
				key = 'last_update';
				break;
			case 'Size':
				key = 'size';
				break;
		}

		let tmp = this.state.files;
		tmp.sort(function(prev,next){
			let a = prev[key];
			let b = next[key];

			if(a === b ){
				return 0;
			}

			if(a < b ){
				return -1*sortOrder;
			}

			if(a > b ){
				return 1*sortOrder;
			}

		});

		this.setState(function(prevState, props){
			return {
				files: tmp
			}
		});

	}

	onOpenCreateFolder(e){
		e.preventDefault();
		this.setState(function(prevState, props){
			return {
				isNewFolderActive: !prevState.isNewFolderActive
			}
		});
	}

	onCreateFolder(e){
		e.preventDefault();
		this.showLoader();
		var self = this;
		config.body = JSON.stringify({ url: this.state.url, name: document.getElementById("txtNewFolder").value });
		fetch("api.asmx/cf", config)
			.then(function(res){
				return res.json()
			}).then(function(data){
				let json = JSON.parse(data.d);
				self.listFiles(self.state.url);
			});
	}

	onRename(e){
		e.preventDefault();
		console.log(this.state.txtNewNameCls);
		if( this.state.txtNewNameCls.indexOf('hide') > -1 ){
			this.setState(function(prevState, props){
				return {
					txtNewNameCls: 'animated slideInUp'
				}
			});
		}
		let txtNewName = document.getElementById("txtNewName");
		let newName = txtNewName.value;
		console.log(newName);
		if(newName && newName.length > 0){
			var self = this;
			this.showLoader();
			let url = this.state.url + "/" + this.filesSelected[0];
			config.body = JSON.stringify({ url: url.replace('//','/'), newName: newName });
			fetch("wsStudio.asmx/Rename", config)
				.then(function(res){
					return res.json()
				}).then(function(data){
					let result = JSON.parse(data.d);
					if( result.result ){
						self.listFiles(self.state.url);
						self.setState(function(prevState, props){
							return {
								txtNewNameCls: 'hide'
							}
						});
						txtNewName.value = '';
					}else{
					}

				});
		}
	}

	onDelete(e){
		e.preventDefault();

		let r = confirm("Are you sure of deleting this " + this.state.filesSelected + " files ?. This operation cannot be undo");

		if(r){
			var self = this;
			this.showLoader();
			config.body = JSON.stringify({ files:  this.filesSelected, url: this.state.url });
			fetch("wsStudio.asmx/Delete", config)
				.then(function(res){
					return res.json()
				}).then(function(data){
					let result = JSON.parse(data.d);
					if( result.result ){
						self.listFiles(self.state.url);
					}
				});
		}

	}

	onSelectFile(e){
		e.preventDefault();
		this.filesSelected = [];
		let checksSelected = document.querySelectorAll("input[type=checkbox]:checked");
		let checksCount = checksSelected.length;
		let i = checksCount;
		while(i--){
			let check = checksSelected[i];
			this.filesSelected.push(check.getAttribute("data-file"));
		}
		this.setState(function(){
			return {
				filesSelected: checksCount
			}
		});
	}

	onCancelUpload(e){
		this.setState(function(prevState, props){
			return {
				filesToUpload: null
			}
		});
	}

	onDownloadFile(e){
		e.preventDefault();
		console.log(e.target);
		var target = e.target;
		if(e.target.tagName === 'I'){
			target = e.target.parentNode;
		}
		var url = target.getAttribute("data-url");
		var aux = config;
		aux.responseType = 'blob';
		aux.body = JSON.stringify({ url: url});
		fetch("wsStudio.asmx/DownloadFile", aux)
			.then(function(r){
				return r.blob();
			})
			.then(function(response){
				var fileParts = url.split("/");
				var fileName = fileParts[fileParts.length - 1];
				if(window.navigator.msSaveOrOpenBlob) { // For IE
					var fileData = [response];
					var blobObject = new Blob(fileData);
					window.navigator.msSaveOrOpenBlob(blobObject, fileName);
				} else{ // For other browsers
					var a = document.createElement('a');
					var newUrl = window.URL.createObjectURL(response);
					a.href = newUrl;
					a.download = fileName;
					a.click();
					window.URL.revokeObjectURL(newUrl);
				}
			});
	}

	render(props, state){

		const self = this;

		const icon = function(extension){
			let cls = "fa fa-file-o";
			switch(extension){
				case ".asp":
					cls='fa fa-file-code-o';
					break;
				case ".aspx":
					cls='fa fa-file-code-o';
					break;
				case ".bmp":
					cls='fa fa-file-image-o';
					break;
				case ".css":
					cls='fa fa-css3';
					break;
				case ".config":
					cls='fa fa-file-code-o';
					break;
				case ".doc":
					cls='fa fa-file-word-o';
					break;
				case ".docx":
					cls='fa fa-file-word-o';
					break;
				case ".dll":
					cls='fa fa-gear';
					break;
				case ".gif":
					cls='fa fa-file-image-o';
					break;
				case ".htm":
					cls='fa fa-html5';
					break;
				case ".html":
					cls='fa fa-html5';
					break;
				case ".inc":
					cls='fa fa-file-code-o';
					break;
				case ".INC":
					cls='fa fa-file-code-o';
					break;
				case ".png":
					cls='fa fa-file-image-o';
					break;
				case ".jpg":
					cls='fa fa-file-image-o';
					break;
				case ".pdf":
					cls='fa fa-file-pdf-o';
					break;
				case ".vb":
					cls='fa fa-windows';
					break;
				case ".xls":
					cls='fa fa-file-excel-o';
					break;
				case ".xlsx":
					cls='fa fa-file-excel-o';
					break;
				case ".zip":
					cls='fa fa-file-zip-o';
					break;
				case "folder":
					cls = "fa fa-folder lightgray";
					break;
			}
			return (
				<i className={cls}></i>
			)
		};

		const files = (state.files && state.files.length > 0) ? state.files.map(function(f){
			return (
				<tr>
					<td>
						{ (  f.extension !== 'folder' ) ?
						<label>
							<input type="checkbox" data-file={ f.name } onChange={ self.onSelectFile } />
							<button data-url={ f.url } onClick={ self.onDownloadFile } class="btn btn-download">
								<i class="fa fa-download"></i>
							</button>
							<a href={ "#/browser/" + f.url } onClick={ self.openPreview }>
								{ icon(f.extension) } { f.name }
							</a>
						</label>
								:
									<label>
										<input type="checkbox" data-file={ f.name } onChange={ self.onSelectFile } />
										<a href={ "#/browser/" + f.url }>
											{ icon(f.extension) } { f.name }
										</a>
									</label>
						}
					</td>
					<td>{ f.extension }</td>
					<td>{ f.last_update }</td>
					<td class="text-right">{ (f.size) ? f.size + " KB" : null } </td>
				</tr>
			);
		}) : null;

		let paths = null;
		if( state.url ){
			const urlParts = state.url.split("/");
			paths =  urlParts.map(function(p, index){
				let pathBefore = "";
				let i = index;
				for( i = 0; i < index; i++ ){
					if(urlParts[i] !== '' && urlParts[i].indexOf('.') === -1 ){
						pathBefore += urlParts[i] + "/";
					}
				}
				return (
					( p !== '') ?  <a href={ "#/browser/" + pathBefore + p }> { p } <i> &#47; </i> </a>  : null
				);
			});
		}


		return (
			<div>
				{ ( state.url) ?
				<div id="browser">
					<FileControls
						filesToUpload={ state.filesToUpload }
						onUpload = { this.upload }
						onUploadChange={ this.onInputChange }
						onCancelUpload={ this.onCancelUpload }
						isNewFolderActive={ state.isNewFolderActive }
						onOpenCreateFolder={ this.onOpenCreateFolder }
						onInputNewFolderChange={ this.onInputNewFolderChange }
						onCreateFolder={ this.onCreateFolder }
					></FileControls>
					<div id="workspace">
						<div id="filterBrowser">
							<span id="paths">
								<a href="#/browser/"> ROOT <i class="fa fa-chevron-right"></i> </a>
								{ paths }
							</span>
							<div id="filterInput">
								<i class="fa fa-search"></i>
								<input id="txtFilterBrowser" type="search" name="txtFilterBrowser" accesskey="f" placeholder="Filter files" onInput = { this.filter } />
							</div>
						</div>
						<div id="tblFilesWrapper">
							<Loader isLoading={ state.isLoading } />
							<table id="tblFiles" class="table table-freeze-header">
								<thead>
									<tr>
										<th onclick={ this.sort }>
											Name
												{ (this.sortOrder===1) ?  <i class="fa fa-chevron-up"></i>
												: <i class="fa fa-chevron-down"></i> }
											</th>
											<th onclick={ this.sort }>
												Type
											</th>
											<th onclick={ this.sort }>
												Date Modified
											</th>
											<th onclick={ this.sort }>
												Size
											</th>
										</tr>
									</thead>
									<tbody>
										{ files }
									</tbody>
								</table>
							</div>
							<div id="barInfo">
								<span>{ state.fileCount } files</span>
								<span>{(  state.filesSelected ) ?   state.filesSelected + ' files selected' : null } </span>
								<span>
									<span id="file-actions" className={ ( state.filesSelected === 1 ? '' : 'hide' ) }>
										<input id="txtNewName" type="text" name="txtNewName" class={ state.txtNewNameCls } />
										<button class="btn-rename" onClick={ this.onRename }><i className="fa fa-pencil" ></i> Rename </button>
									</span>
									<span id="file-actions" className={ ( state.filesSelected ? '' : 'hide' ) }>
										<button class="btn-delete bg-red" onClick={ this.onDelete }><i className="fa fa-trash" ></i> Delete </button>
									</span>
								</span>
							</div>
						</div>
						<div id="filePreview" className={ (state.file) ? '' : 'hide' } >
							<div class="title">
								<h4> { (state.file) ? state.file.name : "" } </h4>
								<button class="close" onclick={ this.closePreview } > &times; </button>
							</div>
							<div class="content">
								{ ( state.file ) ?
										( state.file.isText ) ? <textarea id="txtContent" value={ state.file.content } class="hide" /> : <img src= { state.file.url } />
										: null
								}
							</div>
							<div class="info">
								<span>{ (state.file) ? state.file.extension : ''  }</span>
								<span>{ (state.file) ? state.file.size : '' } KB</span>
							</div>
						</div>
					</div>
				: null }
			</div>
		);
	}
}



function start() {
	preact.render(h(App), document.body);
	window.setTimeout(function(){
		document
			.querySelector("#loader")
			.classList.add("animated", "fadeOut");
	}, 2000);
	window.setTimeout(function(){
		var loader = document.querySelector("#loader");
		var parent = loader.parentNode;
		parent.removeChild(loader);

	}, 2500);

}

start();
