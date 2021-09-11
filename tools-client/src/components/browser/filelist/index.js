import { h } from "preact";
import FileIcon from "../fileicon";

function FileList({ files }) {
    let trs =
        files && files.length > 0
            ? files.map(f => {
                  return (
                      <tr>
                          <td>
                              {f.extension === "folder" ? (
                                  <a href={ "/browser/" + f.url}>
                                      <i class="fa fa-folder"></i>
                                      <i class="fa fa-folder-open" ></i>
                                      {f.name}
                                  </a>
                              ) : (
                                  <label>
                                      <input type="checkbox" />
                                      <FileIcon extension={f.extension} />
                                      {f.name}
                                  </label>
                              )}
                          </td>
                          <td>{f.extension ? f.extension : " "}</td>
			  <td>{f.size ? f.size : " "}</td>
                          <td>{f.last_update ? f.last_update : " "}</td>
                      </tr>
                  );
              })
            : null;

    return (
        <div id="browser-files-list">
            <div id="browser-files-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Modified On</th>
                        </tr>
                    </thead>
                    <tbody>{trs}</tbody>
                </table>
            </div>
            <div id="browser-file-footer">
                <span>{files.length} files</span>
            </div>
        </div>
    );
}

export default FileList;
