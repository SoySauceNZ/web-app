import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';

export default function App() {
    return (
        <>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route path="/upload" component={Upload} />
                    <Route path="/" component={Home} />
                </Switch>
            </Router>
        </>
    );
}
