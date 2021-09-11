import { h } from "preact";

import Pathbar from "../pathbar";
import Search from "../search";

function Header({ path, onFilterInput }) {
    return(
        <div id="browser-file-header" >
            <Pathbar path={ path } />
            <Search onFilterInput={ onFilterInput } />
        </div>
    );
}

export default Header;
