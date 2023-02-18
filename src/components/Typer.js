import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const Typer = () => {
  return (
    <TypeAnimation
    // Same String at the start will only be typed once, initially
    sequence={[
    'Paste you invitation Room id',
    1000,
    'Sync your code with others ',
    1000,
    'Boost you coding experience by coding together'
    ]}
    speed={50} // Custom Speed from 1-99 - Default Speed: 40
    style={{ 
        'margin-bottom': '20px',
        'margin-top': '0',
        'text-align': 'center',
        'color':"#525659"
     }}
    wrapper="h4" // Animation will be rendered as a <span>
    repeat={Infinity} // Repeat this Animation Sequence infinitely
  />
  )
}

export default Typer