import React from 'react';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import Login from './pages/LoginPage/LoginPage';
import Register from './pages/RegisterPage/RegisterPage';
import Profile from './pages/ProfilePage/ProfilePage';
import CreatePost from "./pages/CreatePostPage/CreatePostPage";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import NotFound from './pages/NotFoundPage/NotFoundPage';
import PostPage from "./pages/PostPage/PostPage";
import AuthorPage from "./pages/AuthorPage/AuthorPage";
import GroupListPage from "./pages/GroupListPage/GroupListPage";
import Group from "./pages/GroupPage/GroupPage";

const Routes = ({ setLoadingHeader }) => {
    return (
        <Router>
            <div className="screen">
                <Header
                    setLoading={setLoadingHeader}
                />
                <div className="content">
                    <Switch>
                        <Route path="/" exact element={ <Home /> } />
                        <Route path="/login" element={ <Login /> } />
                        <Route path="/registration" element={ <Register /> } />
                        <Route path="/profile" element={ <Profile /> } />
                        <Route path="/post/create" element={ <CreatePost /> } />
                        <Route path="/post/create/:id" element={ <CreatePost /> } />
                        <Route path="/post" element={ <Home /> } />
                        <Route path="/post/:id" element={ <PostPage />} />
                        <Route path="/authors" element={ <AuthorPage /> } />
                        <Route path="/communities" element={ <GroupListPage /> } />
                        <Route path="/communities/:id" element={ <Group /> } />
                        <Route path="*" element={ <NotFound /> } />
                    </Switch>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default Routes;
