import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@fortawesome/fontawesome-free/js/all.min';
import store from './utils/stores/store';
import Main from './website/components/Main';
import Panel from './dashboard/components/Panel';
import Login from './dashboard/components/Login';
import NotFound from "./utils/components/NotFound/NotFound";
import Example1 from './website/components/Example1';
import Example2 from './website/components/Example2';
import Example3 from './website/components/Example3';

const App = () => {
    return (
        <Router>
            <Provider store={store}>
                <Routes>
                    <Route path="panel/*" element={<Panel />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/example1" element={<Example1 />} />
                    <Route path="/example2" element={<Example2 />} />
                    <Route path="/example3" element={<Example3 />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Provider>
        </Router>
    );
};

render(<App />, document.getElementById('root'));
