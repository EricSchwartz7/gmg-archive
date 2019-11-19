import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const FilterDropdown = (props) =>
    <Dropdown
        icon="filter"
        labeled
        selection
        clearable
        floating
        button
        className="icon"
        placeholder={props.placeholder}
        onClick={props.onClick}
        options={props.options}
        onChange={props.onChange}
    />

export default FilterDropdown;
