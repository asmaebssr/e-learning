import React from 'react'
import Sidebar from '../../components/Sidebar'
import Sections from './Sections'

const Paths = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Learning Paths</h1>
        <div>
          Content for the Paths page
          <Sections />
        </div>
      </div>
    </div>
  )
}

export default Paths