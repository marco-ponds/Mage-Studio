import React from 'react';
import { Switch, Icon, Checkbox, Divider } from 'antd';

const Fog = (props) => (
    <div className='scene-property'>
        <div className='label'>
            <Icon type='cloud' theme='outlined' height='8px' width='8px' className='label-icon'/>
            <span className='label-text'>FOG</span>
        </div>
        <div className='enabled-toggle'>
            <span>active</span>
            <Switch
                size={"small"}
                defaultChecked />
        </div>
    </div>
);

export default Fog;
