import { h } from "preact";
import { useRef, useEffect } from "preact/hooks";

import WindowStates from "../windowStates";
import getWindowHeight from "../getWindowHeight";

import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/mode/sql/sql";

const options = {
    mode: "text/x-mssql",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    autofocus: true,
    theme: "solarized light"
};

function Editor({ windowState, onClickEditorState }) {
    const ref = useRef(null);

    useEffect(() => {
        cm = CodeMirror.fromTextArea(ref.current, options);
    }, []);

    return (
        <div id="sql-editor" style={"height:" + getWindowHeight(windowState)}>
            <div id="sql-editor-header" class="window-title">
                <span>
                    <i class="fa fa-pencil"></i>
                    Editor
                </span>
                <button type="button" onclick={onClickEditorState}>
                    {windowState == WindowStates.NORMAL ? (
                        <i class="fa fa-window-maximize"></i>
                    ) : (
                        <i class="fa fa-window-minimize"></i>
                    )}
                </button>
            </div>
	    <div id="sql-editor-body" style={ "height: calc(100% - 26px);"}>
		    <textarea ref={ref}></textarea>
	    </div>
        </div>
    );
}

export default Editor;
