import * as React from 'react';

export interface DropDownProps {
    items: string[];
}
 
export interface DropDownState {
    open: boolean;
    selectedItem: string;
}
 
class DropDown extends React.Component<DropDownProps, DropDownState> {
    constructor(props: DropDownProps) {
        super(props);
        this.dropDownItem = this.dropDownItem.bind(this);
        this.state = {
            open: false,
            selectedItem: "",
        };
    }

    dropDownItem(name : string) : JSX.Element {
        return (
            <li onClick={() => this.setState({selectedItem: name})}>name</li>
        )
    } 

    render() { 
        return ( 
            <ul>
                
            </ul>
         );
    }
}
 
export default DropDown;