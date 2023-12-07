import React, { useState, useEffect } from 'react';
import styles from './PostForm.module.css';
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";

const PostForm = () => {
    const [errors, setErrors] = useState({});
    const [title, setTitle] = useState('');
    const [readingTime, setReadingTime] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [groups, setGroups] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [text, setText] = useState('');
    const [addressGuid, setAddressGuid] = useState('');
    const { id } = useParams();
    const [selectedGroup, setSelectedGroup] = useState(id);
    const [isFetchedGroupsNames, setIsFetchedGroupsNames] = useState(false);
    const [addressFields, setAddressFields] = useState([]);
    let isEraseField = false;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        fetchTags();
        fetchGroupsId();
        handleAddressSelect();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await fetch('https://blog.kreosoft.space/api/tag');
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchAddress = async (parentObjectId = null, query = null) => {
        try {
            const response = await fetch(
                `https://blog.kreosoft.space/api/address/search?parentObjectId=${parentObjectId || ""}&query=${query || ""}`
            );
            const data = await response.json();
            if (response.ok) {
                return data;
            }
        } catch (error) {
            console.error(`Error fetching addresses:`, error);
        }
    };

    const fetchAddressForField = async (index, query) => {
        if (addressFields[index]) {
            const newAddresses = await fetchAddress(addressFields[index].addressId, query);

            setAddressFields((prevFields) =>
                prevFields
                    .map((field, currentIndex) => ({
                        ...field,
                        addresses: index === currentIndex ? newAddresses : field.addresses,
                    }))
            );
        }
    }

    const handleAddressSelect = async (option = null,
                                       index = -1) => {
        if (index === -1) {
            setAddressFields([]);
            setAddressFields(
                [
                    {
                        level: "Субъект РФ",
                        addressId: null,
                        addressGuid: null,
                        addresses: await fetchAddress(),
                    }
                ]
            );
            setAddressGuid(null);

            return;
        }

        const currentAddresses = await fetchAddress(option.value.objectId);

        setAddressFields((prevFields) =>
            prevFields
                .slice(0, index + 1)
                .map((field, currentIndex) => ({
                    ...field,
                    option:  currentIndex === index ? option : field.option,
                    level: currentIndex === index ? option.value.objectLevelText : field.level,
                }))
        );

        if (currentAddresses.length > 0 && !isEraseField) {
            const newField = {
                level: "Следующий элемент адреса",
                addressId: option.value.objectId,
                addressGuid: option.value.objectGuid,
                addresses: currentAddresses,
            };

                setAddressFields((prevFields) => [...prevFields, newField]);
        }

        setAddressGuid(option.value.objectGuid);
    };

    const fetchGroupsId = async () => {
        try {
            const response = await fetch('https://blog.kreosoft.space/api/community/my', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                navigate('/login');
            }
            const data = await response.json();
            const adminGroups = data.filter(item => item.role === 'Administrator');
            setGroups(adminGroups.map(item => ({ id: item.communityId })));
        } catch (error) {
            console.error('Error fetching groups id:', error);
        }
    };

    const fetchGroupsNames = async () => {
        try {
            const groupNamesPromises = groups.map(async (group) => {
                const response = await fetch(`https://blog.kreosoft.space/api/community/${group.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                return { id: group.id, name: data.name };
            });

            const resolvedGroupNames = await Promise.all(groupNamesPromises);
            setGroups(resolvedGroupNames);
        } catch (error) {
            console.error('Error fetching groups names:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!title || title.length > 50 || title.length < 5) {
            validationErrors.title = 'Заголовок должен быть не пустым и быть от 5 до 50 символов.';
        }

        if (!text || text.length < 5) {
            validationErrors.text = "Текст не может быть пустым или быть меньше 5 символов";
        }

        if (!readingTime || readingTime < 0) {
            validationErrors.readingTime = 'Время чтения не может быть отрицательным числом или пустым';
        }

        const isValidURL = url => {try { new URL(url); return true } catch(e) { return false }}
        if (!isValidURL(imageUrl)) {
            validationErrors.imageUrl = 'Некорректный URL изображения';
        }

        if (selectedTags.length === 0) {
            validationErrors.selectedTags = 'Выберите хотя бы 1 тэг';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            const postData = {
                "title": title,
                "description": text,
                "readingTime": readingTime,
                "image": imageUrl,
                "addressId": addressGuid !== "" ? addressGuid : null,
                "tags": selectedTags,
            };

            let url;
            if (selectedGroup === undefined) {
                url = "https://blog.kreosoft.space/api/post";
            } else {
                url = `https://blog.kreosoft.space/api/community/${selectedGroup}/post`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            if (response.status === 200) {
                setErrors({});
                navigate('/');
            }
            else {
                console.log(response);
                validationErrors.serverError = "Упс, что-то пошло не так...";
                setErrors(validationErrors);
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };


    useEffect(() => {
        if (groups.length > 0 && !isFetchedGroupsNames) {
            fetchGroupsNames();
            setIsFetchedGroupsNames(true);
        }
    }, [groups]);

    return (
        <form className={styles.postForm} onSubmit={handleSubmit}>
            <label className={styles.labelPost}>
                Название поста:
                <input className={styles.inputPost} type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <span className={styles.errorPost}>{errors.title}</span>}
            </label>
            <label className={styles.labelPost}>
                Время чтения:
                <input className={styles.inputPost} type="number" value={readingTime} onChange={(e) => setReadingTime(e.target.value)} />
                {errors.readingTime && <span className={styles.errorPost}>{errors.readingTime}</span>}
            </label>
            <label className={styles.labelPost}>
                Ссылка на изображение:
                <input className={styles.inputPost} type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                {errors.imageUrl && <span className={styles.errorPost}>{errors.imageUrl}</span>}
            </label>
            <label className={styles.labelPost}>
                Выберите группу:
                <select
                    className={styles.selectPost}
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value={""}>Без группы</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </label>
            <label className={styles.labelPost}>
                Тэги:
                <Select
                    isMulti
                    name="tags_select"
                    options={tags.map((tag, _) => ({ label: tag.name, value: tag.id }))}
                    onChange={(e) => setSelectedTags(e.map((tag) => tag.value))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
                {errors.selectedTags && <span className={styles.errorPost}>{errors.selectedTags}</span>}
            </label>
            <label className={styles.labelPost}>
                Текст:
                <textarea className={styles.textareaPost} value={text} onChange={(e) => setText(e.target.value)} />
                {errors.text && <span className={styles.errorPost}>{errors.text}</span>}
            </label>
            {addressFields.map((field, index) => (
                <div>
                    {field.level}
                    <Select
                        className={styles.selectPost}
                        options={field.addresses.map((address) => ({
                            value: address,
                            label: address.text,
                        }))}
                        value={field.option ? ({
                            label: field.option.value.text,
                            value: field.option.value,
                        }) : ""}
                        onChange={(selectedOption) => {
                            handleAddressSelect(selectedOption, index);
                        }}
                        onInputChange={(e) => {
                            fetchAddressForField(index, e);
                        }
                        }
                    />
                </div>
            ))}
            <div>
                <button className={styles.buttonRed} onClick={handleAddressSelect}>Удалить адресс</button>
            </div>
            <button className={styles.buttonPost} type="submit">Создать пост</button>
            {errors.serverError && <div className={styles.errorPost}>{errors.serverError}</div>}
        </form>
    );
};

export default PostForm;