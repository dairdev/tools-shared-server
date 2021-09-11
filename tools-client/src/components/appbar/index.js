import { Component, h, render } from "preact";

class Appbar extends Component {
	render(props) {
		return (
			<div id="appbar" className="flex-row">
				<span>
					<button
						class="navbutton"
						type="button"
						onclick={props.onNavButtonClick}
					>
						<i class="fa fa-navicon"></i>
					</button>
					<span>{props.title}</span>
				</span>
				{props.children}
				<span>
					<button type="button">
						<i class="fa fa-user"></i>
						{currentUser}
					</button>
				</span>
			</div>
		);
	}
}

export default Appbar;
