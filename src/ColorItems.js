import React from 'react'

const ColorItems = ({color, setColor}) => {
  return (
    <div onClick={setColor} className='color-item' style={{'--bg-color':color}}>
        
    </div>
  )
}

export default ColorItems