import React, { Component } from 'react';

import styles from './styles.css';

export default class Top extends Component {
    handleCloseClick() {
        window.parent.postMessage({
            message: 'onCloseIconClicked'
        }, '*');
    }
    render() {
        return (
            <div className={styles.root}>
                <h3 className={styles.title}>Mrs. Hudson</h3>
                <div
                    className={styles.icon_close}
                    onClick={() => this.handleCloseClick()}
                >
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                        <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/>
                    </svg>
                </div>
            </div>
        );
    }
}
