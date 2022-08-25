import {EXPIRED, EXPIRED_1_3, EXPIRED_4_7, EXPIRED_8} from "./list/constants";
import {useMemo, useState} from "react";

const initialStatistic = {
    "": "0/0",
    [EXPIRED]: "0/0",
    [EXPIRED_1_3]: {unread: 0, all: 0},
    [EXPIRED_4_7]: {unread: 0, all: 0},
    [EXPIRED_8]: {unread: 0, all: 0},
}

export const useStatistic = () => {
    const [stat, setStatistic] = useState({})

    const prepValues = useMemo(() => {
        const {
            all,
            allUnread,
            deadline,
            deadlineUnread,
            deadline13,
            deadline13Unread,
            deadline37Unread,
            deadline37,
            termMoreThanWeak,
            termMoreThanWeakUnread
        } = stat

        return {
            "": `${allUnread}/${all}`,
            [EXPIRED]: `${deadlineUnread}/${deadline}`,
            [EXPIRED_1_3]: {unread: deadline13Unread, all: deadline13},
            [EXPIRED_4_7]: {unread: deadline37Unread, all: deadline37},
            [EXPIRED_8]: {unread: termMoreThanWeakUnread, all: termMoreThanWeak},
        }
    }, [stat])

    return {
        setStatistic,
        statistic: Object.keys(stat).length ? prepValues : initialStatistic
    }
}