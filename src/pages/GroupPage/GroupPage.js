import React, {useState, useEffect, useRef} from 'react';
import Filters from '../../components/Filters/Filters';
import PostContainer from '../../components/Posts/PostContainer';
import Pagination from '../../components/Pagination/Pagination';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import GroupInfo from "../../components/GroupInfo/GroupInfo";
import styles from './GroupPage.module.css';

const Group = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [tags, setTags] = useState([]);
    const [rendered, setRendered] = useState(false);
    const [searchParams, setSearchParams] = useState({
        tags: [],
        sorting: 'CreateDesc',
        page: 1,
        size: 5,
    });
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const token = localStorage.getItem('token');
    const filterRef = useRef();

    useEffect(() => {
        fetchGroup();
        fetchTags();
        updateSearchParamsFromUrl();
        setRendered(true);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [group]);

    useEffect(() => {
        navigate(`/communities/${id}/${getLocationSearch(searchParams)}`);
    }, [searchParams, navigate]);

    const scrollUp = () => {
        filterRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const fetchGroup = async () => {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            const role = await getRole(id);
            setGroup({ ...data, role });
        } else {
            navigate(`/communities`);
        }

    }

    const getRole = async (groupId) => {
        if (!token) return null;
        else {
            const response = await fetch(`https://blog.kreosoft.space/api/community/${groupId}/role`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status === 200) {
                return await response.json();
            } else {
                return null;
            }
        }
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
        const url = new URL(`https://blog.kreosoft.space/api/community/${id}/post`);
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
                    return { ...post, address: addressString || 'Адрес ищи в посте!' };
                }));

                setPosts(postsWithAddresses);
                setTotalPages(data.pagination.count);
            } else {
                setPosts(null);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    return (
        <div>
            <div ref={filterRef}></div>
            {group && < GroupInfo
                group={group}
                fetchGroup={fetchGroup}
            />}
            {posts && <div>
                <div className={styles.filters}>
                    <Filters
                        tags={tags}
                        searchParams={searchParams}
                        onSearchParamsChange={handleSearchParamsChange}
                        onSearch={handleSearch}
                        isGroup={true}
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
            </div>}
        </div>
    );
};

export default Group;