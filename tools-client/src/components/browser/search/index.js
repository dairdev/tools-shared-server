import { h } from "preact";

function Search({ onFilterInput }) {
    return (
        <div class="search-control">
            <i class="fa fa-search"></i>
            <input type="search" placeholder="Search" onInput={onFilterInput} />
        </div>
    );
}

export default Search;
