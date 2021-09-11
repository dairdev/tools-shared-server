import { h } from "preact";
import { useState, useCallback } from "preact/hooks";

function DBObject({ object, icon }) {
	const [isOpen, setIsOpen] = useState(false);

	const name = Object.keys(object)[0];

	const details = object[name].map(function(detail) {
		return (
			<li>
				{detail.Name}{" "}
				<span class="sql-explorer-object-detail">
					{detail.Type} {detail.Length != "0" ? "(" + detail.Length + ")" : ""}
				</span>
			</li>
		);
	});

	const onClickDisplayDetails = function() {
		setIsOpen(!isOpen);
	};

	return (
		<div className={isOpen ? "sql-explorer-object-active" : "sql-explorer-object"}>
			<div className="sql-explorer-object-title" title={name}>
				<button type="button" onClick={onClickDisplayDetails}>
					{isOpen ? (
						<i class="fa fa-caret-down"></i>
					) : (
						<i class="fa fa-caret-right"></i>
					)}
				</button>
				<i className={"fa fa-" + icon}></i>
				{name}
			</div>
			<div
				class="sql-explorer-object-details"
				style={"display: " + (isOpen ? "block" : "none")}
			>
				<ul>{details}</ul>
			</div>
		</div>
	);
}

export default DBObject;
