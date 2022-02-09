import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import './home.scss';


export interface HomePropsMatchParams {}

export interface HomeProps extends RouteComponentProps<HomePropsMatchParams>{}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <>
                <header id='landing'>
                    <div>
                        <h1 className='title'>In-sight</h1>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem doloribus mollitia
                            accusantium sed iusto similique, adipisci aut suscipit facilis repellat consequatur!
                            Repellat suscipit similique pariatur dicta rerum quae recusandae laudantium impedit ea
                            cupiditate non velit voluptatum culpa veritatis accusamus repellendus enim voluptatem sequi,
                            quis itaque dolores nam. Provident, voluptatibus sint.
                        </p>
                    </div>
                </header>

                <section className='about-container'>
                    <h1>What i offer:</h1>
                    <div>
                        <div className="about-content">
                            <img alt="news paper" src="https://img.icons8.com/ios/50/000000/document--v1.png"/>
                            <p>I write articles about... and sell them rigth here on my website</p>
                        </div>
                        <div className="about-content">
                            <img alt="hug" src="https://img.icons8.com/ios/50/000000/hug.png"/>
                            <p>Counseling and support for all of life's problems</p>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}

export default Home;
