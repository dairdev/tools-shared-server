"use strict";
const { h, Component, render } = preact; /** @jsx h */
import SqlControls from "./sqlcontrols.js";
import Loader from "./lineloader.js";
import config from "./config.js";
const jsonWorker = new Worker("Scripts/tools/csvTojsonWorker.js");

const storage = window.localStorage;
var cacheSideBar = {};
var cm;
var cache = {};
var procedureSelected = "";
const ls = localStorage.getItem("automation_studio_sql")
    ? JSON.parse(localStorage.getItem("automation_studio_sql"))
    : null;

class Sql extends Component {
    constructor() {
        super();
        this.onSave = this.onSave.bind(this);
        this.onExec = this.onExec.bind(this);
        this.onDescribe = this.onDescribe.bind(this);
        this.onSwitchSideBar = this.onSwitchSideBar.bind(this);
        this.onChangeConnection = this.onChangeConnection.bind(this);
        this.onChangeDatabase = this.onChangeDatabase.bind(this);
        this.onFilterSideBar = this.onFilterSideBar.bind(this);
        this.onFilterTable = this.onFilterTable.bind(this);
        this.onChangeEditor = this.onChangeEditor.bind(this);
        this.onResizeColumn = this.onResizeColumn.bind(this);
        this.onResizeWorkspaceEnd = this.onResizeWorkspaceEnd.bind(this);
        this.onExport = this.onExport.bind(this);
    }

    componentWillMount() {
        this.setState({ isLoading: true });
    }

    componentDidMount() {
        let self = this;
        this.getConnections();

        let query = "";
        let connections = null;
        let databases = null;
        let tables = null;
        let views = null;
        let procedures = null;
        let connection = "";
        let database = "";

        if (ls) {
            query = ls.query;
            connections = ls.connections;
            databases = ls.databases;
            connection = ls.connection;
            database = ls.database;
            tables = ls.tables;
            views = ls.views;
            procedures = ls.procedures;
            cacheSideBar = {
                tables: tables,
                views: views,
                procedures: procedures
            };
        }

        this.setState({
            data: null,
            databases: databases,
            connections: connections,
            connection: connection,
            database: database,
            databases: databases,
            tables: tables,
            views: views,
            procedures: procedures,
            currentView: "tables",
            query: query,
            finished: true,
            isLoading: false
        });

        if (connection && connection !== "") {
            this.getSchema(connection, database);
        }

        cm.options.extraKeys["F5"] = function () {
            self.executeQuery();
            return false;
        };
    }

    showLoadingBar() {
        this.setState(function (prevState, props) {
            return { isLoading: true };
        });
    }

    getConnections() {
        var self = this;
        self.showLoadingBar();
        fetch("api.asmx/cn", config)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                self.setState(function (prevState, props) {
                    return {
                        connections: JSON.parse(data.d),
                        connection: ls && ls.connection,
                        isLoading: false
                    };
                });
            });
    }

    getDatabases(connection) {
        var self = this;
        this.setState({ connection: connection, isLoading: true });
        config.body = JSON.stringify({ connectionName: connection });
        fetch("api.asmx/db", config)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                self.setState({
                    databases: JSON.parse(data.d),
                    isLoading: false
                });
                self.saveLocalState();
            });
    }

    getSchema(connection, database) {
        var self = this;
        this.setState({
            connection: connection,
            database: database,
            isBarUpdating: true,
            isLoading: true
        });
        config.body = JSON.stringify({
            connectionName: connection,
            databaseName: database
        });
        fetch("api.asmx/sch", config)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                var json = JSON.parse(data.d);
                self.setState({
                    tables: json.tables,
                    views: json.views,
                    procedures: json.procedures,
                    isBarUpdating: false,
                    isLoading: false
                });
                cacheSideBar = {
                    tables: json.tables,
                    views: json.views,
                    procedures: json.procedures
                };
                self.saveLocalState();
            });
    }

    onChangeConnection(e) {
        this.getDatabases(e.target.value);
    }

    onChangeDatabase(e) {
        var dbname = e.target.value;
        if (e.target.tagName !== "SELECT") {
            dbname = document.getElementById("ddlDatabases").value;
        }
        this.getSchema(document.getElementById("ddlConnections").value, dbname);
    }

    onFilterSideBar(e) {
        var self = this;
        var text = e.target.value.trim();
        this.setState(function (prevState, props) {
            return {
                isBarUpdating: true
            };
        });
        if (text) {
            var data = cacheSideBar[this.state.currentView];
            var aux = data.filter(function (item) {
                var name = Object.keys(item)[0];
                return name.indexOf(text) > -1;
            });
            this.setState(function (prevState, props) {
                return {
                    [prevState.currentView]: aux,
                    isBarUpdating: false
                };
            });
        } else {
            this.setState(function (prevState, props) {
                return {
                    [prevState.currentView]:
                        cacheSideBar[prevState.currentView],
                    isBarUpdating: false
                };
            });
        }
    }

    saveLocalState() {
        let query = cm.getValue();
        this.setState(function (props, prevState) {
            return { query: query };
        });
        let stateCopy = this.state;
        stateCopy.data = null;
        window.localStorage.setItem(
            "automation_studio_sql",
            JSON.stringify(stateCopy)
        );
        stateCopy = null;
    }

    executeQuery() {
        var self = this;
        this.saveLocalState();
        var query = cm.getSelection().trim() || cm.getValue().trim();
        this.setState({
            query: query,
            finished: null,
            data: null,
            messages: null
        });
        config.body = JSON.stringify({
            connectionName: this.state.connection,
            databaseName: this.state.database,
            query: query
        });
        fetch("api.asmx/eq", config)
            .then(function (res) {
                return res.text();
            })
            .then(function (text) {
                jsonWorker.postMessage(text);

                jsonWorker.onmessage = function (e) {
                    let json = e.data;
                    self.setState(function (prevState, props) {
                        return {
                            data: { Table: json.table },
                            messages: json.messages,
                            finished: true
                        };
                    });
                    cache.Table = json.table;
                };
            });
    }

    onSave(e) {
        e.preventDefault();
        this.saveLocalState();
    }

    onExec(e) {
        e.preventDefault();
        this.executeQuery();
    }

    onDescribe(e) {
        e.preventDefault();
        if (this.state.currentView === "procedures") {
            var self = this;
            self.showLoadingBar();
            config.body = JSON.stringify({
                connectionName: this.state.connection,
                databaseName: this.state.database,
                procedureName: procedureSelected
            });
            fetch("api.asmx/d", config)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    let query = cm.getValue();
                    cm.setValue(
                        query + "\n\n" + JSON.parse(data.d).Description
                    );
                    self.setState(function (prevState, props) {
                        return {
                            isLoading: false
                        };
                    });
                    cm.execCommand("goPageDown");
                });
        }
    }

    onFilterTable(e) {
        var self = this;
        var text = e.target.value;
        self.setState(function (prevState, props) {
            return { finished: false };
        });
        if (text) {
            var data = cache.Table;
            var aux = data.filter(function (record) {
                var keys = Object.keys(record);
                for (var k in keys) {
                    var field = record[keys[k]];
                    if (field && field.toString().indexOf(text) > -1) {
                        return true;
                    }
                }
            });
            //Debouncing
            window.setTimeout(function () {
                self.setState(function (prevState, props) {
                    return { data: { Table: aux }, finished: true };
                });
            }, 500);
        } else {
            window.setTimeout(function () {
                self.setState(function (prevState, props) {
                    return { data: { Table: cache.Table }, finished: true };
                });
            }, 500);
        }
    }

    onSwitchSideBar(e) {
        let elm = e.target;
        if (elm.tagName === "I") {
            elm = elm.parentNode;
        }
        let id = elm.getAttribute("id");
        this.setState({ currentView: id.substr(4, id.length) });
    }

    onChangeEditor(e) {
        this.setState({ query: e.target.value });
    }

    onResizeWorkspaceEnd(e) {
        e.preventDefault();
        let workspaceEditor = document.getElementById("workspace-editor");
        let tableData = document.getElementById("table-data");
        let rect = e.target.getBoundingClientRect();
        workspaceEditor.style.cssText = "height: " + e.clientY + "px";
        let height = "height: calc( 100% - " + (e.clientY + 155) + "px )";
        tableData.style.cssText = height;
    }

    onResizeColumn(e) {
        let div = e.target.parentNode;
        let rect = e.target.getBoundingClientRect();
        let rectDiv = div.getBoundingClientRect();
        let delta = e.clientX - rect.right;
        let newWidth = rectDiv.width + delta;
        if (rect.right < rectDiv.right) {
            delta = rect.right - e.clientX;
            newWidth = rectDiv.width - delta;
        }
        div.style.width = newWidth + "px";
    }

    onExport(e) {

        let dataTable = cache.Table;
        //Validate that exists results
        if(!dataTable || dataTable.length == 0){
            //Show alert when results are empty
            return;
        }

        var CSV = '';
        var row = '';

        var dataLength = dataTable.length;
        var cols = Object.keys(dataTable[0]);
        for(var c in cols){
            var h = cols[c];
            row+= h + '\t';
        }
        row += '\r\n';
        //This loop will extract the label from 1st index of on array
        for (var index in dataTable) {
            //Now convert each value to string and comma-seprated
            //row += query + '\r\n';
            var record = dataTable[index];
            for(var c in cols){
                //row+= cols[c] + ',';
                var field = cols[c];
                var value = record[field];
                if(typeof value === 'object' && value){
                    //row+= value.toLocaleString() + ',';
                    row+= value.toLocaleString() + '\t';
                }else{
                    //row+= value + ',';
                    row+= value + '\t';
                }
            }
            row = row.slice(0, -1);
            row += '\r\n';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';

        //Generate a file name
        var fileName = "Export_Data_" + (new Date()).getTime();

        //Initialize file format you want csv or xls
        //var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        //link.style = "visibility:hidden";
        link.style.visibility = "hidden";
        link.download = fileName + ".xls";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render(props, state) {
        return (
            <div>
                <SqlControls
                    onExec={this.onExec}
                    onSave={this.onSave}
                    onDescribe={this.onDescribe}
                />
                <Loader isLoading={this.state.isLoading} />
                <div id="sql">
                    <Sidebar
                        connections={this.state.connections}
                        databases={this.state.databases}
                        tables={this.state.tables}
                        views={this.state.views}
                        procedures={this.state.procedures}
                        currentView={this.state.currentView}
                        connection={this.state.connection}
                        database={this.state.database}
                        isUpdating={this.state.isBarUpdating}
                        onSave={this.onSave}
                        onExec={this.onExec}
                        onSwitchSideBar={this.onSwitchSideBar}
                        onChangeConnection={this.onChangeConnection}
                        onChangeDatabase={this.onChangeDatabase}
                        onFilterSideBar={this.onFilterSideBar}
                    />
                    <Workspace
                        data={this.state.data}
                        finished={this.state.finished}
                        messages={this.state.messages}
                        onFilter={this.onFilterTable}
                        onExport={this.onExport}
                        onChange={this.onChangeEditor}
                        onDragEnd={this.onResizeColumn}
                        onResizeWorkspaceEnd={this.onResizeWorkspaceEnd}
                    />
                </div>
            </div>
        );
    }
}

class DbObject extends Component {
    constructor() {
        super();
        this.state = {
            currentNode: "",
            nodeClass: ""
        };
        this.onClickNode = this.onClickNode.bind(this);
        this.onClickIcon = this.onClickIcon.bind(this);
    }

    onClickIcon(e) {
        var elm = e.target;
        if (elm.tagName === "I") {
            elm = elm.parentNode;
        }
        var text = elm.getAttribute("data-text");
        if (this.state.currentNode != text) {
            this.setState({ currentNode: text });
        } else {
            this.setState({ currentNode: "" });
        }
    }

    onClickNode(e) {
        e.preventDefault();
        this.setState(function (prevState, props) {
            return {
                nodeClass: "selected"
            };
        });
    }

    render(props, state) {
        return (
            <li
                className={
                    props.text === state.currentNode ? state.nodeClass : ""
                }
                data-text={props.text}
                title={props.text}
                onClick={this.onClickNode}
            >
                <i
                    onclick={this.onClickIcon}
                    className={
                        this.state.currentNode == props.text
                            ? "fa fa-caret-down noselect"
                            : "fa fa-caret-right noselect"
                    }
                ></i>{" "}
                &nbsp;
                {props.text.toString()}
                <ul class={this.state.currentNode == props.text ? "" : "hide"}>
                    {props.fields}
                </ul>
            </li>
        );
    }
}

class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            currentNode: ""
        };
        this.onClickSideBarData = this.onClickSideBarData.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result =
            this.props.connections !== nextProps.connections ||
            this.props.connection !== nextProps.connection ||
            this.props.databases !== nextProps.databases ||
            this.props.tables !== nextProps.tables ||
            this.props.views !== nextProps.views ||
            this.props.procedures !== nextProps.procedures ||
            this.props.isUpdating !== nextProps.isUpdating ||
            this.props.currentView !== nextProps.currentView;
        return result;
    }

    onClickSideBarData(e) {
        let elm = e.target;
        if (elm.tagName === "A" || elm.tagName === "I") {
            elm = elm.parentNode;
        }
        var text = elm.getAttribute("data-text");
        if (this.state.currentNode !== text) {
            this.setState(function (prevState, props) {
                return { currentNode: text };
            });
            procedureSelected = text;
        }
    }

    render(props, state) {
        let connections = [];
        let databases = [];
        let tables, views, procedures;
        if (props.connections) {
            connections = props.connections.map(function (con) {
                return <option value={con}>{con}</option>;
            });
        }
        if (props.databases) {
            databases = props.databases.map(function (db) {
                return <option value={db}> {db} </option>;
            });
        }
        if (props.tables) {
            tables = props.tables.map(function (item) {
                let text = Object.keys(item);

                let fields = item[text].map(function (field) {
                    let name = field.Name;
                    let length = "";
                    if (parseInt(field.Length) > 0) {
                        length = "(" + field.Length + ")";
                    }
                    let type = field.Type + length;
                    return (
                        <li>
                            <span>{name}</span>
                            <span>{type}</span>
                        </li>
                    );
                });

                return (
                    <DbObject
                        text={text}
                        fields={fields}
                        currentNode={state.currentNode}
                    />
                );
            });
        }
        if (props.views) {
            views = props.views.map(function (item) {
                var text = Object.keys(item);

                var fields = item[text].map(function (field) {
                    var name = field.Name;
                    var type = field.Type + "(" + field.Length + ")";
                    return (
                        <li>
                            <span>{name}</span>
                            <span>{type}</span>
                        </li>
                    );
                });

                return (
                    <DbObject
                        text={text}
                        fields={fields}
                        currentNode={state.currentNode}
                    />
                );
            });
        }
        if (props.procedures) {
            //console.log(props.procedures);
            procedures = props.procedures.map(function (item) {
                var text = Object.keys(item);

                var fields = item[text].map(function (field) {
                    var name = field.Name;
                    var type =
                        field.Type +
                        (field.Length !== "0" ? "(" + field.Length + ")" : "");
                    return (
                        <li>
                            <span>{name}</span>
                            <span>{type}</span>
                        </li>
                    );
                });

                return (
                    <DbObject
                        text={text}
                        fields={fields}
                        currentNode={state.currentNode}
                    />
                );
            });
        }

        return (
            <div id="sidebar">
                {!connections ? null : (
                    <div id="sidebar-header">
                        <div id="sidebar-connections">
                            <i className="fa fa-sitemap"></i>
                            <select
                                id="ddlConnections"
                                name="ddlConnections"
                                onchange={props.onChangeConnection}
                                value={props.connection}
                            >
                                {connections}
                            </select>
                        </div>
                        <div id="sidebar-databases">
                            <i className="fa fa-database"></i>
                            <select
                                id="ddlDatabases"
                                name="ddlDatabases"
                                onchange={props.onChangeDatabase}
                                value={props.database}
                            >
                                {databases ? (
                                    databases
                                ) : (
                                    <option value="0">
                                        Select a connection
                                    </option>
                                )}
                            </select>
                        </div>
                        <div id="sidebar-filter">
                            <i className="fa fa-search"></i>
                            <input
                                id="txtFilterSideBar"
                                type="search"
                                placeholder="Search"
                                accesskey="f"
                                onInput={props.onFilterSideBar}
                                onChange={props.onFilterSideBar}
                            />
                        </div>
                        <div id="sidebar-filters">
                            <button
                                onclick={props.onSwitchSideBar}
                                id="btn-tables"
                                class={
                                    this.props.currentView === "tables"
                                        ? "active"
                                        : ""
                                }
                            >
                                <i class="fa fa-table"></i>
                            </button>
                            <button
                                onclick={props.onSwitchSideBar}
                                id="btn-procedures"
                                class={
                                    this.props.currentView === "procedures"
                                        ? "active"
                                        : ""
                                }
                            >
                                <i class="fa fa-gears"></i>
                            </button>
                            <button
                                onclick={props.onSwitchSideBar}
                                id="btn-views"
                                class={
                                    this.props.currentView === "views"
                                        ? "active"
                                        : ""
                                }
                            >
                                <i class="fa fa-eye"></i>
                            </button>
                        </div>
                        <div
                            id="sidebar-data"
                            onclick={this.onClickSideBarData}
                        >
                            <ul
                                id="tables"
                                class={
                                    this.props.currentView === "tables"
                                        ? "active"
                                        : ""
                                }
                            >
                                {!props.tables ? (
                                    <li>List of Tables</li>
                                ) : (
                                    tables
                                )}
                            </ul>
                            <ul
                                id="views"
                                class={
                                    this.props.currentView === "views"
                                        ? "active"
                                        : ""
                                }
                            >
                                {!props.views ? <li>List of Views</li> : views}
                            </ul>
                            <ul
                                id="procedures"
                                class={
                                    this.props.currentView === "procedures"
                                        ? "active"
                                        : ""
                                }
                            >
                                {!props.procedures ? (
                                    <li>List of Procedures</li>
                                ) : (
                                    procedures
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

class Workspace extends Component {
    render(props, state) {
        return (
            <div id="workspace">
                <section id="workspace-editor">
                    <Editor onChange={props.onChange}></Editor>
                </section>
                <section id="workspace-data">
                    <div
                        draggable="true"
                        ondragend={props.onResizeWorkspaceEnd}
                        class="resizer horizontal_resizer"
                    >
                        <i class="fa fa-chevron-up"></i>
                        <i class="fa fa-chevron-down"></i>
                    </div>
                    <Table
                        data={props.data}
                        onDragEnd={props.onDragEnd}
                        onFilter={props.onFilter}
                        onExport={props.onExport}
                        finished={props.finished}
                        messages={props.messages}
                    ></Table>
                </section>
            </div>
        );
    }
}

class Editor extends Component {
    componentDidMount() {
        if (!cm) {
            cm = CodeMirror.fromTextArea(document.querySelector("textarea"), {
                mode: "text/x-mssql",
                theme: "monokai",
                height: "200px",
                styleActiveLine: true,
                scrollbarStyle: "overlay",
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true,
                extraKeys: { "Ctrl-Space": "autocomplete" }
            });
            cm.setSize();

            if (ls && ls.query) {
                cm.setValue(ls.query);
            }
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render(props, state) {
        return <textarea></textarea>;
    }
}

var Table = function (props) {
    var ths = null;
    var msg = null;
    var rows = null;
    var index = 0;
    var loaderClass = "loader_wrapper";
    if (props.finished) {
        loaderClass += " hide";
    }
    if (this.props.data) {
        if (this.props.data.Table && this.props.data.Table.length > 0) {
            var firstRow = this.props.data.Table[0];
            ths = Object.keys(firstRow).map(function (r) {
                let header = r.toString();
                return (
                    <th>
                        <div class="table-header">
                            <span class="header-title">{header}</span>
                            <span
                                class="spacer"
                                draggable="true"
                                ondragend={props.onDragEnd}
                            >
                                &nbsp;
                            </span>
                        </div>
                    </th>
                );
            });

            var tds = function (record) {
                var row = Object.keys(record).map(function (r) {
                    return <td>{record[r].replace(/\t/, "&emsp;", "gi")}</td>;
                });
                return row;
            };

            rows = this.props.data.Table.map(function (record) {
                var tdsRef = tds(record);
                return (
                    <tr>
                        <th> {++index} </th>
                        {tdsRef}
                    </tr>
                );
            });
        } else {
        }
    } else {
        if (this.state.isLoading === true) {
            rows = (
                <tr>
                    <td colspan="2">Loading...</td>
                </tr>
            );
        } else {
            rows = (
                <tr>
                    <td colspan="2">There is no data</td>
                </tr>
            );
        }
    }
    if (props.messages) {
        msg = this.props.messages.map(function (message) {
            return <li class="text-red"> {message} </li>;
        });
    }
    return (
        <div>
            <div id="table-toolbar">
                <div>
                    <input
                        type="search"
                        width="250px"
                        placeholder="Search value in the table"
                        onInput={props.onFilter}
                        onChange={props.onFilter}
                    />
                    <span> # Rows: {index} </span>
                </div>
                <div>
                    <button id="btn-export" title="Export data as CSV" onClick={props.onExport}>
                        <i className="fa fa-download"></i>
                    </button>
                </div>
            </div>
            <div id="table-data">
                <div class={loaderClass}>
                    {" "}
                    <div class="loader"> </div>{" "}
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th width="30px">N</th>
                            {ths ? (
                                ths
                            ) : (
                                <th width="200px">
                                    <div class="table-header">
                                        <span class="header-title">Column</span>
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>{rows ? rows : null}</tbody>
                </table>
            </div>
            <div id="message">
                <h4>Messages</h4>
                <p>
                    <ul>{msg ? msg : <li>&nbsp;</li>}</ul>
                </p>
            </div>
        </div>
    );
};

export default Sql;
