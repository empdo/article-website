import * as React from 'react';
import "./contact.scss"

export interface ConactProps {
    
}
 
export interface ConactState {
    
}
 
class Conact extends React.Component<ConactProps, ConactState> {
    constructor(props: ConactProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return (
            <main id="contactpage-container">
                <h1>Contact me!</h1>
                <div id="contact-container">
                    <div id="email-container">
                        <textarea placeholder="Full name" rows={1}></textarea>
                        <textarea placeholder="Email" rows={1}></textarea>
                        <textarea placeholder="Content" rows={7}></textarea>
                        <button>Send</button>
                    </div>
                    <div className="info-container">
                        <h2>Email:</h2>
                        <p>your@email.com</p>

                        <h2>Based in:</h2>
                        <p>Some city, some country</p>
                    </div>

                </div>
            </main>
        );
    }
}
 
export default Conact;