import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem =
    ({ key, title, icon, link, mainMenu, ...props }) =>
        <Menu.Item
            key={key || link}
            {...props}
        >
            <Link to={link || key}>
                {icon && <Icon type={icon} style={{fontSize: 15}}/>}
                <span className={mainMenu?'main-nav-text':'nav-text'}>{title}</span>
            </Link>
        </Menu.Item>;

const renderSubMenu =
    ({ key, title, icon, link, mainMenu,sub, ...props }) =>
        <Menu.SubMenu
            key={key || link}
            title={
                <span>
                    {icon && <Icon type={icon} style={{fontSize: 15}}/>}
                    <span className={mainMenu?'main-nav-text':'nav-text'}>{title}</span>
                </span>
            }
            {...props}
        >
            {sub && sub.map(item => renderMenuItem(item))}
        </Menu.SubMenu>;

export default ({ menus, ...props }) => <Menu {...props}>
    {menus && menus.map(
        item => item.sub && item.sub.length ?
            renderSubMenu(item) : renderMenuItem(item)
    )}
</Menu>;