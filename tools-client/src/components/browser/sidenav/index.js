import { h } from "preact";

function Sidenav() {
	const drives = ["C:\\", "D:\\"],
		bookmarks = [
			{ icon: "globe", name: "Global", path: "/browser/" },
		];

	const drivesLinks = drives
		? drives.map((d) => {
				return (
					<a
						class="browser-drives-link"
						href={"/browser/" + d}
					>
						<span class="fa fa-hdd-o"></span>
						Drive {d}
					</a>
				);
		  })
		: null;

	const bookmarksLinks = bookmarks
		? bookmarks.map((b) => {
				return (
					<a
						class="browser-drives-link"
						href={b.path}
					>
						{b.icon ? (
							<i
								class={
									"fa fa-" +
									b.icon
								}
							></i>
						) : null}
						{b.name}
					</a>
				);
		  })
		: null;

	return (
		<div id="browser-sidenav">
			<div id="browser-sidenav-title">
				<i className="fa fa-sitemap"></i>
				Navigation
			</div>
			<div id="browser-sidenav-section-title">
				<span class="fa fa-hdd"></span>
				Drives
			</div>
			<div
				id="browser-sidenav-links"
				className="flex-column"
			>
				{drivesLinks}
			</div>
			<div id="browser-sidenav-section-title">
				<span class="fa fa-bookmark"></span>
				Bookmarks
			</div>
			<div
				id="browser-sidenav-links"
				className="flex-column"
			>
				{bookmarksLinks}
			</div>
		</div>
	);
}

export default Sidenav;
