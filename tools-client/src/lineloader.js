"use strict";
const { h, Component, render } = preact; /** @jsx h */

const Loader = function(props){
	return (
		<div id="module-loader" >
				{ ( props.isLoading ) ?  <div className="loader"></div> :'' }
			</div>
				);
};

export default Loader;
