import { h } from "preact";

function Connection({
    connections,
    databases,
    onChangeConnection,
    onChangeDatabase
}) {

    const optConnections = (connections && connections.length > 0) ? connections.map(function (connection) {
        return <option value={connection}>{connection}</option>;
    }): null;

    const optDatabases = (databases && databases.length > 0) ? databases.map(function (database) {
        return <option value={database}>{database}</option>;
    }): null;


    return (
        <div id="sql-explorer-connections">
            <div class="flex-row">
                <i class="fa fa-sitemap"></i>
                <select id="ddlConnection" name="ddlConnection" onchange={ onChangeConnection }>
                    <option value="0">Select a connection</option>
                    {connections ? optConnections : null}
                </select>
            </div>
            <div class="flex-row">
                <i class="fa fa-database"></i>
                <select id="ddlDatabase" name="ddlDatabase" onchange={ onChangeDatabase }>
                    <option value="0">Select a database</option>
                    {databases ? optDatabases : null}
                </select>
            </div>
        </div>
    );
}

export default Connection;
