import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Post from "../../components/Post/Post";
import styles from './PostPage.module.css';
import CommentBlock from "../../components/CommentBlock/CommentBlock";

const PostPage = () => {
    const [isScrolled, setScrolled] = useState(false);
    const { id } = useParams();
    const commentsRef = useRef(null);
    const [postData, setPostData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');


    const getAddressString = async (addressGuid) => {
        const url = `https://blog.kreosoft.space/api/address/chain?objectGuid=${addressGuid}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const addressData = await response.json();

                return addressData.map((item) => item.text).join(', ');
            } else {
                console.error('Error fetching address:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            return null;
        }
    };

    const fetchPostData = async () => {
        try {
            const response = await fetch(`https://blog.kreosoft.space/api/post/${id}`, {
                method: 'GET',
                    headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                const address = await getAddressString(data.addressId);
                data.address =  address ? address : "Адрес не указан";
                setPostData(data);
            } else {
                navigate('/not-found');
                console.error('Error fetching post data:', data);
            }
        } catch (error) {
            navigate('/not-found');
            console.error('Error fetching post data:', error);
        }
    };

    useEffect(() => {
        fetchPostData();
    }, [id]);

    useEffect(() => {
        if (postData && (window.location.hash === '#comments' && !isScrolled)) {
            commentsRef.current.scrollIntoView({ behavior: 'smooth' });
            setScrolled(true);
        }
    }, [postData]);

    if (!postData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.postPlace}>
            < Post
                post={postData}
                fetchPosts={fetchPostData}
            />
            < CommentBlock
                comments={postData.comments}
                refreshPost={fetchPostData}
                postId={postData.id}
            />
            <div ref={commentsRef}></div>
        </div>
    );
};

export default PostPage;
