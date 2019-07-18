import Link from 'next/link'
import React from 'react';
import { Menu, Dropdown, Icon, message, Col, Row, Divider } from 'antd';

import ProjectMenu from './menu/ProjectMenu';
import SceneMenu from './menu/SceneMenu';

import Logo from './Logo';
import './header.scss';

const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
};

const menu = (
    <Menu onClick={onClick}>
        <Menu.Item className="option" key="1">1st menu item</Menu.Item>
        <Menu.Item className="option" key="2">2nd memu item</Menu.Item>
        <Divider/>
        <Menu.Item className="option" key="3">3rd menu item</Menu.Item>
    </Menu>
);

const Header = () => (
    <div className="header">
        <Logo />
        <ProjectMenu />
        <SceneMenu />
        <Dropdown overlay={menu}>
            <span className="main-menu-item" href="#">
                View
            </span>
        </Dropdown>
        <Dropdown overlay={menu}>
            <span className="main-menu-item" href="#">
                Help
            </span>
        </Dropdown>
    </div>
);

export default Header;