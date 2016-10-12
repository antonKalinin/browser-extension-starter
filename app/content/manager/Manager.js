import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Top from './components/Top/Top';
import Messenger from './../../Messenger';

class Manager extends Component {
    render() {
        return (
            <main>
                <Top />
            </main>
        );
    }
}

ReactDom.render(<Manager />, document.getElementById('container'));

// Set listeners for messages from background scrtipt
const messenger = new Messenger('content', 'mrs.hudson');

