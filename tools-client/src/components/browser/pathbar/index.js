import { h, Fragment } from "preact";

function Pathbar({ path }) {
    var pathParts = path
        ? path
        .replace( "/browser/", "")
        .split("/")
        .map((p, index, arr) => {
            let pathBefore = "";
            if (
                arr[index] !== "" &&
                arr[index].indexOf(".") === -1
            ) {
                for(let i = 0; i < index; i ++){
                    pathBefore += arr[i] + "/";
                }
                let newUrl =  "/browser/" + pathBefore + p;
                return p !== "" ? (
                    <Fragment>
                        <a href={ newUrl }>
                            {p}
                        </a>
                        <i> &gt; </i>
                    </Fragment>
                ) : null;
            }
        }) : null;

    return  (
        <div id="browser-paths">
            {
                (path.indexOf(":") == -1)
                    ? 
                        <Fragment>
                            <a href={ "/browser/" }>
                                /
                            </a>
                            <i> &gt; </i>
                        </Fragment>
                        : null
            }
            {pathParts}
        </div>
    )
}

export default Pathbar;
