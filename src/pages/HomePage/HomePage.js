import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters/Filters';
import PostContainer from '../../components/Posts/PostContainer';
import Pagination from '../../components/Pagination/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tags, setTags] = useState([]);
    const [rendered, setRendered] = useState(false);
    const [searchParams, setSearchParams] = useState({
        tags: [],
        author: '',
        min: null,
        max: null,
        sorting: 'CreateDesc',
        onlyMyCommunities: false,
        page: 1,
        size: 5,
    });
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTags();
        updateSearchParamsFromUrl();
        setRendered(true);
    }, []);

    useEffect(() => {
        navigate(`/${getLocationSearch(searchParams)}`);
    }, [searchParams, navigate]);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }

    const getLocationSearch = (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (key === 'tags' && Array.isArray(value) && value.length > 0) {
                value.forEach((item) => searchParams.append(key, item));
            } else if (value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
                searchParams.set(key, value);
            }
        });
        return searchParams.toString() ? `?${searchParams.toString()}` : '';
    };

    const updateSearchParamsFromUrl = () => {
        const urlSearchParams = new URLSearchParams(location.search);
        const newSearchParams = {};

        urlSearchParams.forEach((value, key) => {
            if (key === 'tags') {
                if (!newSearchParams[key]) {
                    newSearchParams[key] = [];
                }
                newSearchParams[key].push(value);
            } else {
                newSearchParams[key] = value;
            }
        });

        setSearchParams((prevParams) => ({
            ...prevParams,
            ...newSearchParams,
        }));
    };


    const fetchTags = async () => {
        try {
            const response = await fetch('https://blog.kreosoft.space/api/tag');
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleSearchParamsChange = (param, value) => {
        if (param === "page") {
            setSearchParams((prevParams) => ({
                ...prevParams,
                [param]: value,
            }));
            scrollUp();
        } else {
            setSearchParams((prevParams) => ({
                ...prevParams,
                [param]: value,
                "page": 1,
            }));
            scrollUp();
        }
    };

    const handleSearch = () => {
        fetchPosts();
    };

    useEffect(() => {
        if (rendered) {
            handleSearch();
        }
    }, [searchParams]);

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

    const fetchPosts = async () => {
        const url = new URL('https://blog.kreosoft.space/api/post');
        Object.entries(searchParams).forEach(([key, value]) => {
            if (key === 'tags' && Array.isArray(value) && value.length > 0) {
                value.forEach((item) => url.searchParams.append(key, item));
            } else if (
                value !== null &&
                value !== undefined &&
                value !== '' &&
                !(Array.isArray(value) && value.length === 0)
            ) {
                url.searchParams.set(key, value);
            }
        });

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                    headers: {
                    Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.status === 200) {
                const postsWithAddresses = await Promise.all(data.posts.map(async (post) => {
                    const addressString = await getAddressString(post.addressId);
                    return { ...post, address: addressString || 'Адрес не указан' };
                }));

                setPosts(postsWithAddresses);
                setTotalPages(data.pagination.count);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <div>
            <div>
                <Filters
                    tags={tags}
                    searchParams={searchParams}
                    onSearchParamsChange={handleSearchParamsChange}
                    onSearch={handleSearch}
                />
            </div>

            <PostContainer
                posts={posts}
                onAttributeChange={handleSearchParamsChange}
                fetchPosts={fetchPosts}
            />

            <Pagination
                totalPages={totalPages}
                searchParams={searchParams}
                onPageChange={handleSearchParamsChange}
            />
        </div>
    );
};

export default Home;