import * as React from 'react';

export interface PurchaseCardProps {}
 
export interface PurchaseCardState {}
 
class PurchaseCard extends React.Component<PurchaseCardProps, PurchaseCardState> {
    constructor(props: PurchaseCardProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return (
            <div className="purchase-card">
                <p>€12.99</p>
                <button>Purchase</button>
            </div>
        
        );
    }
}
 
export default PurchaseCard;