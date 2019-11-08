import React from 'react'

export default ({ onClick, label }) => (
  <button style={{ backgroundColor: '#d3d3d3' }} onClick={onClick}>
    {label}
  </button>
)
