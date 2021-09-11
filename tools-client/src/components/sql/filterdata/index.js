import { h } from "preact";

function FilterData({ onFilterInput }) {
    return (
        <div id="sql-filter-data">
            <div class="search-control">
                <i class="fa fa-search"></i>
                <input type="search" placeholder="Search" onInput={ onFilterInput } />
            </div>
        </div>
    );
}

export default FilterData;
