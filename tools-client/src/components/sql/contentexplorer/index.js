import { h } from "preact";

import DBObject from "../dbobject";

function ContentExplorer({ type, objects }) {
	const tables = (objects && objects.tables) ? objects.tables.map(function(table) {
		return <DBObject object={table} icon="table" />;
	}) : null;
	const procedures = (objects && objects.procedures) ? objects.procedures.map(function(procedure) {
		return <DBObject object={procedure} icon="cogs" />;
	}) : null;
	const views = (objects && objects.views) ? objects.views.map(function(view) {
		return <DBObject object={view} icon="eye" />;
	}) : null;

	return (
		<div id="sql-explorer-content">
			<div class="sql-explorer-content-type" style={"display: " + (type == "tables" ? "block" : "none")}>
				{tables}
			</div>
			<div class="sql-explorer-content-type" style={"display: " + (type == "procedures" ? "block" : "none")}>
				{procedures}
			</div>
			<div class="sql-explorer-content-type" style={"display: " + (type == "views" ? "block" : "none")}>
				{views}
			</div>
		</div>
	);
}

export default ContentExplorer;
