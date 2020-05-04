import $ from 'jquery';
import React  from 'react';
import './TutorialStyle.css';

export default class Zoom extends React.Component {
    state = { isOpen: false };

    handleShowDialog = () => {
        this.setState({ isOpen: !this.state.isOpen });
        console.log("cliked");
    };

    render() {
        return (
            <div>
                <img
                    src={this.props.source}
                    onClick={this.handleShowDialog}
                    alt="no image"
                    width ="80%"
                />
                {this.state.isOpen && (
                    <dialog
                        className="dialog"
                        open
                        onClick={this.handleShowDialog}
                    >
                        <img
                            className="big"
                            src={this.props.source}
                            onClick={this.handleShowDialog}
                            alt="no image"
                        />
                    </dialog>
                )}
            </div>

        );
    }
}
