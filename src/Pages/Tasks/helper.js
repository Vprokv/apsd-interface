import {
  EXPIRED,
  EXPIRED_1_3,
  EXPIRED_4_7,
  EXPIRED_8,
  EXPIRED_TODAY,
} from './list/constants'
import { useMemo, useState } from 'react'

const initialStatistic = {
  '': '0/0',
  [EXPIRED]: '0/0',
  [EXPIRED_1_3]: { unread: 0, all: 0 },
  [EXPIRED_TODAY]: { unread: 0, all: 0 },
  [EXPIRED_4_7]: { unread: 0, all: 0 },
  [EXPIRED_8]: { unread: 0, all: 0 },
}

export const useStatistic = (stat) =>
  useMemo(() => {
    if (!stat) {
      return initialStatistic
    }

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
      termMoreThanWeakUnread,
      deadlineToday,
      deadlineTodayUnread,
    } = stat[0]

    return {
      '': `${allUnread}/${all}`,
      [EXPIRED]: `${deadlineUnread}/${deadline}`,
      [EXPIRED_TODAY]: { unread: deadlineTodayUnread, all: deadlineToday },
      [EXPIRED_1_3]: { unread: deadline13Unread, all: deadline13 },
      [EXPIRED_4_7]: { unread: deadline37Unread, all: deadline37 },
      [EXPIRED_8]: { unread: termMoreThanWeakUnread, all: termMoreThanWeak },
    }
  }, [stat])
