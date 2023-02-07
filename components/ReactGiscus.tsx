import type React from 'react'
import Giscus from '@giscus/react'
import { giscusConfig } from 'lib/config'

import styles from './styles.module.css'

function ReactGiscus({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={styles.comments}>
      <Giscus
        {...{
          ...giscusConfig.config(),
          theme: darkMode ? 'dark_dimmed' : 'light'
        }}
      />
    </div>
  )
}

export default ReactGiscus
