import { h } from "preact";

function FileIcon({ extension }) {
    let cls = "fa fa-file-o";

    switch (extension) {
        case ".asp":
            cls = "fa fa-file-code-o";
            break;
        case ".aspx":
            cls = "fa fa-file-code-o";
            break;
        case ".bmp":
            cls = "fa fa-file-image-o";
            break;
        case ".css":
            cls = "fa fa-css3";
            break;
        case ".config":
            cls = "fa fa-file-code-o";
            break;
        case ".doc":
            cls = "fa fa-file-word-o";
            break;
        case ".docx":
            cls = "fa fa-file-word-o";
            break;
        case ".dll":
            cls = "fa fa-gear";
            break;
        case ".gif":
            cls = "fa fa-file-image-o";
            break;
        case ".htm":
            cls = "fa fa-html5";
            break;
        case ".html":
            cls = "fa fa-html5";
            break;
        case ".inc":
            cls = "fa fa-file-code-o";
            break;
        case ".INC":
            cls = "fa fa-file-code-o";
            break;
        case ".png":
            cls = "fa fa-file-image-o";
            break;
        case ".jpg":
            cls = "fa fa-file-image-o";
            break;
        case ".pdf":
            cls = "fa fa-file-pdf-o";
            break;
        case ".vb":
            cls = "fa fa-windows";
            break;
        case ".xls":
            cls = "fa fa-file-excel-o";
            break;
        case ".xlsx":
            cls = "fa fa-file-excel-o";
            break;
        case ".zip":
            cls = "fa fa-file-zip-o";
            break;
        case "folder":
            cls = "fa fa-folder lightgray";
            break;
    }

    return <i class={cls}></i>;
}

export default FileIcon;
