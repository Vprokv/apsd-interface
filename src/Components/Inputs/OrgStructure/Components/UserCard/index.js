import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {UserCircle} from "./styles";
import colorFromString from "@Components/Utils/colorFromString";

const UserCard = ({firstName = "", lastName = "", middleName = "", position} = {}) => {
  const fio = useMemo(() => `${lastName} ${firstName && `${firstName[0]}.` || ""} ${middleName && `${middleName[0]}.` || "aaa"}`, [firstName, lastName, middleName])
  console.log(fio, 'fio')
  const bg = useMemo(() => {
    return typeof firstName === "string" && colorFromString(firstName, 30, 80)
  }, [fio])

  return (
    <div className="flex items-center justify-center">
      {/*<UserCircle bg={"hsl(88, 30%, 80%)"} className="mr-2">*/}
      {/*  {`${lastName.length && lastName[0]} ${firstName.length && firstName[0]}`}*/}
      {/*</UserCircle>*/}
      <div>
        <div className="font-size-14">
          {fio}
        </div>
        <div className="font-size-12 color-text-secondary">
          {position}
        </div>
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