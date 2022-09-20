import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {UserCircle} from "./styles";
import colorFromString from "@Components/Utils/colorFromString";

const UserCard = (
  {
    firstName = "",
    lastName = "",
    middleName = "",
    position,
    department,
    widthDepartment = false
  } = {}) => {
  const fio = useMemo(() => `${lastName} ${firstName?.length && `${firstName[0]}.` || ""} ${middleName?.length && `${middleName[0]}.` || ""}`, [firstName, middleName, lastName])

  const bg = useMemo(() => {
    return typeof fio === "string" && colorFromString(fio, 30, 80)
  }, [fio])

  return (
    <div className="flex items-center justify-center">
      <UserCircle bg={bg} className="mr-2">
        {`${lastName?.length && lastName[0]} ${firstName?.length && firstName[0] || ""}`}
      </UserCircle>
      <div>
        <div className="font-size-14 mb-2">
          {fio}
        </div>
        <div className="font-size-12 color-text-secondary mb-1">
          {position}
        </div>
        {widthDepartment && <div className="font-size-12 color-text-secondary">
          {department}
        </div>}
      </div>
    </div>
  );
};

UserCard.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string.isRequired,
    secondName: PropTypes.string,
    position: PropTypes.string,
  })
};

UserCard.defaultProps = {};

export default UserCard;