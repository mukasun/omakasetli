import React from 'react'
import clsx from 'clsx'
import styles from '@/styles/components/Loader.module.scss'

type Props = {
  color?: string
  size?: number
}

export const Loader: React.FC<Props> = ({ color, size }) => {
  return (
    <div className={styles.ellipsisWrapper}>
      <div
        className={clsx([styles.ellipsis, styles.ellipsisFirst])}
        style={{ backgroundColor: color, width: size, height: size }}
      />
      <div
        className={clsx([styles.ellipsis, styles.ellipsisSecond])}
        style={{ backgroundColor: color, width: size, height: size }}
      />
      <div
        className={clsx([styles.ellipsis, styles.ellipsisThird])}
        style={{ backgroundColor: color, width: size, height: size }}
      />
    </div>
  )
}
