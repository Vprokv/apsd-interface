import React from 'react';
import PropTypes from 'prop-types';
import Select from './Select'
import Icon from '@Components/Components/Icon'
import searchIcon from "@/Icons/searchIcon";
import styled from "styled-components";

export const SearchButton = styled.button.attrs({ type: "button" })`
  background-color: var(--light-blue);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: var(--form--elements_height);
  width: var(--form--elements_height);
`

const UserSelect = props => {
  return (
    <div className="flex items-center w-full">
      <Select {...props} />
      <SearchButton className="ml-1">
        <Icon icon={searchIcon}/>
      </SearchButton>
    </div>
  );
};

UserSelect.propTypes = {

};

export default UserSelect;