import { h } from "preact";

const Alert = ({ title, content, type, isOpen, onClickButton }) => {
    return (
        <div class="alert" style={"display: " + (isOpen ? "flex" : "none")}>
            <span class="alert-body">
                <span class="alert-title">{title}</span>
                <span class="alert-content">{content}</span>
            </span>
            <button type="button" onClick={onClickButton}>
                {
                    {
                        close: <i className="fa fa-close"></i>,
                        refresh: (
                            <span style="color: white;">
                                <i className="fa fa-refresh"></i> Refresh{" "}
                            </span>
                        )
                    }[type]
                }
            </button>
        </div>
    );
};

export default Alert;
