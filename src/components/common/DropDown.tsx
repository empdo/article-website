import React from 'react';
import './dropDown.scss';

export interface DropDownItem {
    text: string;
    callback: () => void;
}

export interface DropDownProps {
    options: DropDownItem[];
    children: React.ReactNode | React.ReactNode[];
}

export interface DropDownState {
    shouldShow: boolean;
}

class DropDown extends React.Component<DropDownProps, DropDownState> {
    constructor(props: DropDownProps) {
        super(props);
        this.showDropDown = this.showDropDown.bind(this);
        this.hideDropDown = this.hideDropDown.bind(this);
        this.state = {
            shouldShow: false,
        };
    }

    showDropDown(e: any) {
        e.preventDefault();
        e.stopPropagation()
        
        this.setState({ shouldShow: true }, () => {
            document.addEventListener('click', this.hideDropDown);
        });

    }
    hideDropDown() {
        this.setState({ shouldShow: false }, () => {
            document.removeEventListener('click', this.hideDropDown);
            console.log(this.state.shouldShow);
        });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.hideDropDown);
    }

    items(): JSX.Element[] {
        console.log(this.props.options);
        return this.props.options.map((option, index) => {
            return <button onClick={option.callback} key={index} >{option.text}</button>;
        });
    }

    render() {
        return (
            <div className='dropDown-container'>
                <button className="main-button" onClick={this.showDropDown}>{this.props.children}</button>
                <div className="dropdown-content">
                    {this.state.shouldShow && this.items()}
                </div>
            </div>
        );
    }
}

export default DropDown;
