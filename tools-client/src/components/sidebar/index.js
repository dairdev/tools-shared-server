import { h } from "preact";

const Sidebar = ({ current }) => {
	return (
		<nav id="sidebar">
			<div id="sidebar-logo">
				<svg
					enable-background="new 0 0 510.934 510.934"
					version="1.1"
					viewBox="0 0 510.93 510.93"
				>
					<path
						d="M482.133,386.133V76.8c0-9.6-7.467-17.067-17.067-17.067h-416C39.467,59.733,32,67.2,32,76.8v309.333  H482.133z"
						fill="#334A5E"
					/>
					<rect
						x="65.07"
						y="92.8"
						width="382.93"
						height="260.27"
						fill="#84DBFF"
					/>
					<path
						d="m0 406.4c0 11.733 9.6 20.267 20.267 20.267h470.4c11.733 0 20.267-9.6 20.267-20.267 0-11.733-9.6-20.267-20.267-20.267h-470.4c-10.667 0-20.267 9.6-20.267 20.267z"
						fill="#F2F2F2"
					/>
					<g fill="#fff">
						<polygon points="189.87 281.6 131.2 222.93 189.87 165.33 206.93 182.4 166.4 222.93 206.93 264.53" />
						<polygon points="322.13 281.6 380.8 222.93 322.13 165.33 305.07 182.4 345.6 222.93 305.07 264.53" />
						<polygon points="262.4 152.53 224 294.4 249.6 294.4 288 152.53" />
					</g>
					<g fill="#CDD6E0">
						<polygon points="446.93 451.2 65.067 451.2 37.333 426.67 474.67 426.67" />
						<path d="m284.8 412.8h-57.6c-3.2 0-6.4-3.2-6.4-6.4s3.2-6.4 6.4-6.4h57.6c3.2 0 6.4 3.2 6.4 6.4s-3.2 6.4-6.4 6.4z" />
					</g>
					<polygon
						points="474.67 426.67 462.93 437.33 49.067 437.33 37.333 426.67"
						fill="#B8C9D8"
					/>
				</svg>
			</div>
			<div>
				<ul>
					<li>
						<a
							href="/browser"
							class={
								current ==
								"browser"
									? "active"
									: ""
							}
						>
							<i class="fa fa-globe"></i>
						</a>
					</li>
					<li>
						<a
							href="/sql"
							class={
								current == "sql"
									? "active"
									: ""
							}
						>
							<i class="fa fa-server"></i>
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Sidebar;
