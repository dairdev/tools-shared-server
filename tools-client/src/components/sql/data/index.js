import { h } from "preact";

import WindowStates from "../windowStates";
import getWindowHeight from "../getWindowHeight";

import FilterData from "../filterdata";

function Data({ windowState, records, onClickDataState, onFilterInput }) {

	if (records == null) return;

	if (records.length == 0) {
		records = [
			{
				Data: "There is no data",
			},
		];
	}

	const headers = Object.keys(records[0]);

	const ths = headers.map(function (header, index) {
		return <th>{header}</th>;
	});

	const trs = records.map(function (record, index) {
		return (
			<tr>
				<th>{index + 1}</th>
				{headers.map(function (header, index) {
					return <td>{record[header]}</td>;
				})}
			</tr>
		);
	});

	return (
		<div
			id="sql-data"
			style={"height:" + getWindowHeight(windowState)}
		>
			<div id="sql-data-header" class="window-title">
				<span>
					<i class="fa fa-table"></i>Data
				</span>
				<button
					type="button"
					onclick={onClickDataState}
				>
					{windowState == WindowStates.NORMAL ? (
						<i class="fa fa-window-maximize"></i>
					) : (
						<i class="fa fa-window-minimize"></i>
					)}{" "}
				</button>
			</div>
			{windowState != WindowStates.MINIMIZED ? (
				<FilterData onFilterInput={onFilterInput} />
			) : null}
			{windowState != WindowStates.MINIMIZED ? (
				<div id="sql-data-table-wrapper" className="flex-column">
					<table width="100%">
						<thead>
							<tr>
								<th>N</th>
								{ths}
							</tr>
						</thead>
						<tbody>{trs}</tbody>
						<tfoot>
							<tr>
								<th> </th>
								<th>
									Rows:{" "}
									{
										records.length
									}
								</th>
							</tr>
						</tfoot>
					</table>
				</div>
			) : null}
		</div>
	);
}

export default Data;
