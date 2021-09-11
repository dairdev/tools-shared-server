"use strict";
const { h, Component, render } = preact; /** @jsx h */

export default class Browser2 extends Component {

    componentDidMount() {
        console.log("Browser is mounted");
    }

    render(){
        return(
            <span>TEST</span>
                );
    }

}
