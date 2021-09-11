import { h } from "preact";

import WindowStates from "../windowStates";

function Logs({ windowState, messages, onClickLogState }) {
	const logMessages =
		messages && messages.length > 0
			? messages.map(function (msg) {
					return <li> {msg} </li>;
			  })
			: null;

	return (
		<div
			id="sql-logs"
			style={
				"height:" +
				(windowState === WindowStates.NORMAL
					? "15vh"
					: "26px")
			}
		>
			<div id="sql-logs-header" class="window-title">
				<span>
					<i class="fa fa-list-alt"></i>
					Logs
				</span>
				<button type="button" onClick={onClickLogState}>
					{windowState === WindowStates.NORMAL ? (
						<i class="fa fa-window-maximize"></i>
					) : (
						<i class="fa fa-window-minimize"></i>
					)}
				</button>
			</div>
			<div id="sql-logs-content">{ logMessages }</div>
		</div>
	);
}

export default Logs;
