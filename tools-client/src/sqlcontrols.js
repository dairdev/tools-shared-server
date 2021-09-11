"use strict";
const { h } = preact; /** @jsx h */

const SqlControls = function ( props ){
    return (
        <header>
            <h3 class="noselect">
                <i class="fa fa-connectdevelop noselect"></i>&nbsp;
                    Studio
            </h3>
            <div id="header-controls">
                <button id="btnNew" onclick={this.props.onNew } title="Create a new tab" >
                    <i className="fa fa-plus-circle"></i>
                        New
                </button>
                <button id="btnSave" onclick={ this.props.onSave } title="Save current script on localStorage" >
                    <i className="fa fa-floppy-o"></i>
                        Save
                </button>
                <span class="separator"></span>
                <button id="btnExec" onclick={this.props.onExec} title="Execute the query selected">
                    <i className="fa fa-bolt"></i>
                        Execute
                </button>
                <button id="btnBatch" onclick={this.props.onBatch} title="Execute query and download result as CSV">
                    <i className="fa fa-cogs"></i>
                        Batch
                </button>
            </div>
        </header>
    );
}

export default SqlControls;
