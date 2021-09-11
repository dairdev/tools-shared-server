"use strict";
const { h } = preact; /** @jsx h */

const FileControls = function ( props ){

	let files = null;
	if( props.filesToUpload ){
		files = props.filesToUpload.map(function(f){
			return(
				<li className="file-to-upload">
					<span className="file-name"> { f }</span>
				</li>
					)
		});
	}

	if ( props.isNewFolderActive ) {
		document.getElementById("txtNewFolder").focus();
	}

	var divFilesClass = "header-float-panel panel-uploader hide";
	if( props.filesToUpload ) {
		divFilesClass = "header-float-panel panel-uploader animated zoomIn";
	}

	return (
		<header>
			<h3 class="noselect">
				<i class="fa fa-connectdevelop noselect"></i>&nbsp;
					Studio
			</h3>
			<div id="header-controls">
				<div id="wrapperUpload">
					<form id="formUpload">
						<input id="inputUpload" type="file" name="inputUpload" onChange={ props.onUploadChange } multiple />
						<div class="mask">
							<i className="fa fa-cloud-upload"></i>
								Upload
						</div>
						<div className={ divFilesClass } >
							<ul>
									{ files }
							</ul>
							<div style="text-align: right; margin-top: .3em; ">
								<button className="btn-file text-green" onClick={ props.onUpload }>
									<i className="fa fa-check"></i> Accept
								</button>
								<button type="reset" className="btn-cancel" onClick={ props.onCancelUpload }>
									<i className="fa fa-ban"></i> Cancel
								</button>
							</div>
						</div>
					</form>
				</div>
				<button id="btnCreateDir" onclick={ props.onOpenCreateFolder } >
					<i className="fa fa-folder-open"></i>
						New Folder
				</button>
				<div className={ "header-float-panel " + (( props.isNewFolderActive ) ? 'animated zoomIn' : 'hide' ) } >
					<div style="display: flex;  justify-content: space-between;">
						<input id="txtNewFolder" autofocus type="text" size="30" onkeydown = { props.onInputNewFolderChange } />
						<button className="btn-accept" onClick={ props.onCreateFolder }>
							<i className="fa fa-check"></i> Accept
						</button>
					</div>
				</div>
			</div>
		</header>
			);
}

export default FileControls;
