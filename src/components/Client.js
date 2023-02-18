import React from 'react'
import Avatar from 'react-avatar'

const Client = ({username}) => {
  return (
    <div className='client'>
        <Avatar name={username} size={50} round={'14px'} />
        <h5 className='userName'>{username}</h5>
    </div>
  )
}

export default Client