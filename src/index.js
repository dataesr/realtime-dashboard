// TODO: Integrate Bootstrap as Design System : https://react-bootstrap.github.io/getting-started/introduction/
// TODO: Add spinner while loading sites status
// TODO: Add more services from the DOAD
// TODO: Add react-dsfr as Design System
import axios from 'axios'
import React from 'react'

import './index.css'
import ReactDOM from "react-dom";

class Card extends React.Component {
    render() {
        return (
            <div className="card">
                <h4>{this.props.label}</h4>
                <p className="status">
                    <span className={this.props.status} />
                    <span>Card status</span>
                </p>
            </div>
        )
    }
}

async function check_status(url) {
    let result = {}
    try {
        result = await axios.post(url, {headers: {'Access-Control-Allow-Origin': '*'}})
    } catch (err) {
        result.status = err.response.status
    }
    return result.status === 200 ? 'green' : 'red'
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: [{
                url: 'https://scanr-api.enseignementsup-recherche.gouv.fr/api/v2/publications/search',
                label: 'scanR API'
            }, {
                url: 'scanr.enseignementsup-recherche.gouv.fr/',
                label: 'scanR'
            }]
        }
    }

    async componentDidMount() {
        const sites = await Promise.all(this.state.sites.map(async site => {
            site.status = await check_status(site.url)
            return site
        }))
        this.setState({ sites })
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <ul>
                        {this.state.sites.map(site =>
                            <li key={site.url}>
                                <Card label={site.label} status={site.status} />
                            </li>
                        )}
                    </ul>
                </header>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
