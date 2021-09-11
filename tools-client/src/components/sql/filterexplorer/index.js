import { h } from "preact";

function FilterExplorer({ type, onClickFilter, onChangeTextFilter }) {
    return (
        <div id="sql-filter-explorer">
            <div id="sql-filter-types" class="flex-row">
                <button type="button" className={type=="tables" ? "active": ""} onClick={onClickFilter} value="tables">
                    <i class="fa fa-table"></i>
                </button>
                <button type="button" className={type=="procedures"?"active":""} onClick={onClickFilter} value="procedures">
                    <i class="fa fa-cogs"></i>
                </button>
                <button type="button" className={type=="views"?"active":""} onClick={onClickFilter} value="views">
                    <i class="fa fa-eye"></i>
                </button>
            </div>
            <div id="sql-filter-explorer-text" class="search-control">
                <i class="fa fa-search"></i>
                <input type="search" placeholder="Search" onInput={ onChangeTextFilter } />
            </div>
        </div>
    );
}

export default FilterExplorer;
