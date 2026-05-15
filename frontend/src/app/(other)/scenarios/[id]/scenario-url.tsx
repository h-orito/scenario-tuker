'use client'

import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

const ScenarioUrl = ({ scenario }: { scenario: ScenarioResponse }) => {
  if (!scenario.url) {
    return <></>
  }

  return (
    <div className='mt-6'>
      <Link href={scenario.url} target='_blank'>
        {scenario.url}&nbsp;
        <FontAwesomeIcon icon={faExternalLink} className='h-4' />
      </Link>
    </div>
  )
}
export default ScenarioUrl
