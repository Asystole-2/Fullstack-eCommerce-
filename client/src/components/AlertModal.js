// AlertModal.js
import React, { Component } from "react";

export default class AlertModal extends Component {
    render() {
        const { show, message, onClose } = this.props;

        if (!show) {
            return null;
        }

        return (
            <div className="modal-overlay2">
                <div className="modal-content2">
                    <p>{message}</p>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }}>Close</button>
                </div>
            </div>
        );
    }
}