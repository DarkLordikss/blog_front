import React, { useEffect, useState } from 'react';
import styles from './Filters.module.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const Filters = ({ tags, searchParams, onSearchParamsChange, isGroup = false }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [tagsLoaded, setTagsLoaded] = useState(false);
    const [defaultTags, setDefaultTags] = useState([]);
    const [tagsOptions, setTagsOptions] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        if (tags.length > 0) {
            setTagsLoaded(true);
        }
    }, [tags]);

    useEffect(() => {
        if (tagsLoaded) {
            setDefaultTags(searchParams.tags.map((tag) => ({
                label: tags.filter((option) => tag === option.id)[0].name,
                value: tag,
            })));
        }
    }, [tagsLoaded, searchParams.tags]);

    useEffect(() => {
        if (tagsLoaded) {
            setTagsOptions(tags.map((tag) => ({ label: tag.name, value: tag.id })));
        }
    }, [tagsLoaded, tags]);

    return (
        <div className={styles.filterContainer}>
            {!isGroup && <input
                type="text"
                placeholder="Поиск по автору"
                value={searchParams.author}
                onChange={(e) => onSearchParamsChange('author', e.target.value)}
            />}

            <Select
                isMulti
                name="tags_select"
                value={defaultTags}
                options={tagsOptions}
                onChange={(e) => onSearchParamsChange('tags', e.map((tag) => tag.value))}
                className={styles.select__control}
                classNamePrefix="select"
            />

            <select
                value={searchParams.sorting}
                onChange={(e) => onSearchParamsChange('sorting', e.target.value)}
            >
                <option value="CreateAsc">Дата создания (по возрастанию)</option>
                <option value="CreateDesc">Дата создания (по убыванию)</option>
                <option value="LikeAsc">Лайки (по возрастанию)</option>
                <option value="LikeDesc">Лайки (по убыванию)</option>
            </select>

            {!isGroup && <input
                type="number"
                placeholder="Время чтения от"
                value={searchParams.min || ''}
                onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/, '');
                    onSearchParamsChange('min', e.target.value);
                }}
            />}
            {!isGroup && <input
                type="number"
                placeholder="Время чтения до"
                value={searchParams.max || ''}
                onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/, '');
                    onSearchParamsChange('max', e.target.value);
                }}
            />}

            {!isGroup && token &&
                <div>
                    <div>Только мои группы</div>
                    <input
                        type="checkbox"
                        checked={Boolean(searchParams.onlyMyCommunities)}
                        onChange={() => onSearchParamsChange('onlyMyCommunities', !searchParams.onlyMyCommunities)}
                    />
                </div>
            }
        </div>
    );
};

export default Filters;
