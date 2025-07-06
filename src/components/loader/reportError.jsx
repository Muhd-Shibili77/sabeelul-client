import React from 'react'

const ReportError = ({content,error}) => {
  return (
    <div className="flex items-center bg-white rounded-xl shadow justify-center h-[77vh] w-full">
        <div className="text-center">
          <h2 className="text-red-600 text-lg font-semibold">
            {content}
          </h2>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
      </div>
  )
}

export default ReportError