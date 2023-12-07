import React, {useEffect, useState} from 'react';
import styles from "./GroupList.module.css";
import GroupCard from "../GroupCard/GroupCard";

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        getGroups();
    }, []);

    const getGroups = async () => {
        const response = await fetch('https://blog.kreosoft.space/api/community');

        if (response.status === 200) {
            const data = await response.json();
            const groupsWithRoles = await Promise.all(data.map(async (group) => {
                const role = await getRole(group.id);
                return { ...group, role };
            }));
            setGroups(groupsWithRoles);
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

    return (
        <div className={styles.groupList}>
            {groups.map((group) => (
                <GroupCard key={group.id} group={group} fetchGroups={getGroups} />
            ))}
        </div>
    );
}

export default GroupList;