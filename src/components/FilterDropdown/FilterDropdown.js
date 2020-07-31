import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';

const FilterDropdown = (props) =>
    <Form.Select
        // icon="filter"
        // fluid
        // labeled
        // selection
        clearable
        // floating
        // button
        // className="icon"
        placeholder={props.placeholder}
        onClick={props.onClick}
        options={props.options}
        onChange={props.onChange}/>

export default FilterDropdown;
