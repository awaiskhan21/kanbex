import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { useEffect, useState } from 'react'

function getWindowSize() {
  const { innerWidth, innerHeight } = window

  return { innerHeight, innerWidth }
}

export default function ResponsiveMedicineTable(props: {
  theads: Array<string>
  list: Array<any>
  objectKeys: Array<string>
  fieldsToDisplay: Array<number>
}) {
  const [windowSize, setWindowSize] = useState(getWindowSize())

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize())
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <>
      {windowSize.innerWidth > 1024 ? (
        <table className="min-w-full">
          <thead>
            <tr>
              {props.theads.map((item, idx) => {
                return (
                  <th
                    key={idx}
                    className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-800"
                  >
                    {item}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {props.list.map((med: any, index: number) => (
              <tr key={index} className="bg-white">
                {props.objectKeys.map((key, idx) => {
                  if (idx === 0)
                    return (
                      <td className="w-[450px] px-6 py-4 text-sm font-medium leading-5 text-gray-900">
                        {med[key]}
                      </td>
                    )
                  else
                    return (
                      <td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-gray-900">
                        {med[key]}
                      </td>
                    )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="rounded-md shadow-sm">
          {props.list.map((med: any, index: number) => (
            <Accordion key={index} elevation={0}>
              <AccordionSummary
                aria-controls={`panel${index + 1}a-content`}
                className="overflow-hidden"
                expandIcon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                id={`panel${index + 1}a-header`}
              >
                <div className="grid">
                  <div className="flex flex-col">
                    <h3 className="w-full overflow-hidden text-ellipsis text-sm font-medium">
                      {med[props.objectKeys[0]]}
                    </h3>
                  </div>
                  <div className="mt-2 flex w-full gap-[160px]">
                    {props.fieldsToDisplay?.map((i, idx) => (
                      <div key={idx}>
                        <h4 className="text-base font-semibold">{props.theads[i]}</h4>
                        {med[props.objectKeys[i]]}
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails className="border-t border-t-gray-400">
                <div className="flex w-full flex-col">
                  <div className="grid w-full grid-cols-2 gap-3">
                    {props.objectKeys.map((key, i) => {
                      if (i !== 0 && i !== props.objectKeys.length - 1)
                        return (
                          <div>
                            <h4 className="text-base font-semibold">{props.theads[i]}</h4>{' '}
                            <p>{med[key]}</p>
                          </div>
                        )

                      if (i === props.objectKeys.length - 1)
                        return (
                          <div className="col-span-2">
                            <h4 className="text-base font-semibold">{props.theads[i]}</h4>{' '}
                            <p>{med[key]}</p>
                          </div>
                        )
                    })}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </>
  )
}
