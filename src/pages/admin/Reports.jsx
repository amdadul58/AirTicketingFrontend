import { useEffect, useState } from 'react'
import {
  getRevenueReport,
  getBookingsByStatus,
  getTopAirlines,
  getTopRoutes,
  getTopUsers,
} from '../../api/reports'

import Loader from '../../components/Loader'
import { apiErrorMessage } from '../../utils/helpers'
import {
  canChart,
  RevenueChart,
  StatusPieChart,
  RankingBarChart,
} from '../../components/ReportCharts'


function todayMinus(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}


// Render backend response
function DataBlock({ data }) {

  if (data === null || data === undefined) {
    return <p className="text-slate-450 text-sm">No data.</p>
  }


  // Revenue report special format
  if (
    data?.series &&
    Array.isArray(data.series)
  ) {
    return (
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Date</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {data.series.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.date}
                </td>

                <td>
                  ${Number(item.revenue).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    )
  }


  // Array response
  if (Array.isArray(data)) {

    if (!data.length) {
      return <p className="text-slate-450 text-sm">No data.</p>
    }

    const cols = Object.keys(data[0])

    return (
      <div className="table-wrap">
        <table className="data">

          <thead>
            <tr>
              {cols.map(col => (
                <th key={col}>
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>


          <tbody>
            {data.map((row,index)=>(
              <tr key={index}>
                {cols.map(col=>(
                  <td key={col}>
                    {String(row[col] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    )
  }



  // Object response
  if (typeof data === 'object') {

    return (
      <div className="grid sm:grid-cols-3 gap-3">

        {Object.entries(data).map(([key,value])=>(
          <div key={key} className="card !p-4">

            <p className="eyebrow">
              {key.replace(/_/g,' ')}
            </p>

            <p className="font-display font-semibold text-navy-900 mt-1">

              {
                Array.isArray(value)
                  ? JSON.stringify(value)
                  : String(value)
              }

            </p>

          </div>
        ))}

      </div>
    )
  }



  return (
    <p className="text-sm text-navy-900">
      {String(data)}
    </p>
  )
}




function Section({title,children}){

  return (
    <div>

      <h2 className="font-display font-semibold text-navy-900 mb-3">
        {title}
      </h2>

      {children}

    </div>
  )
}





export default function Reports(){


  const [range,setRange] = useState({
    start: todayMinus(30),
    end: todayMinus(0)
  })


  const [revenue,setRevenue] = useState(null)
  const [byStatus,setByStatus] = useState(null)
  const [topAirlines,setTopAirlines] = useState(null)
  const [topRoutes,setTopRoutes] = useState(null)
  const [topUsers,setTopUsers] = useState(null)


  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')



  const loadAll = () => {

    setLoading(true)
    setError('')


    const days = Math.ceil(
      (
        new Date(range.end) -
        new Date(range.start)
      ) /
      (1000 * 60 * 60 * 24)
    )


    Promise.all([

      // Backend: /dashboard/revenue?days=dynamic
      getRevenueReport(days),

      getBookingsByStatus(),

      getTopAirlines(5),

      getTopRoutes(5),

      getTopUsers(5),

    ])

    .then(([rev,status,air,routes,users])=>{

      setRevenue(rev.data)

      setByStatus(status.data)

      setTopAirlines(air.data)

      setTopRoutes(routes.data)

      setTopUsers(users.data)

    })

    .catch(err=>{

      setError(apiErrorMessage(err))

    })

    .finally(()=>{

      setLoading(false)

    })

  }



  useEffect(()=>{

    loadAll()

  },[])



  return (

    <div className="flex flex-col gap-8">

      <div>

        <p className="eyebrow">
          Business insight
        </p>

        <h1 className="text-3xl font-semibold text-navy-900 mt-2">
          Reports
        </h1>

      </div>



      <form
        onSubmit={(e)=>{
          e.preventDefault()
          loadAll()
        }}
        className="flex gap-2 items-end flex-wrap"
      >

        <div>
          <label className="label">
            From
          </label>

          <input
            type="date"
            className="input"
            value={range.start}
            onChange={e=>setRange({
              ...range,
              start:e.target.value
            })}
          />
        </div>



        <div>
          <label className="label">
            To
          </label>

          <input
            type="date"
            className="input"
            value={range.end}
            onChange={e=>setRange({
              ...range,
              end:e.target.value
            })}
          />
        </div>


        <button className="btn btn-primary">
          Run reports
        </button>

      </form>



      {
        error &&
        <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">
          {error}
        </div>
      }



      {
        loading ?

        <Loader label="Crunching numbers"/>

        :

        <>

          <Section title="Revenue">

            {
              canChart(revenue) &&
              <div className="card !p-4 mb-4">
                <RevenueChart data={revenue}/>
              </div>
            }

            <DataBlock data={revenue}/>

          </Section>



          <Section title="Bookings by status">

            {
              canChart(byStatus) &&
              <div className="card !p-4 mb-4">
                <StatusPieChart data={byStatus}/>
              </div>
            }

            <DataBlock data={byStatus}/>

          </Section>



          <Section title="Top airlines">

            {
              canChart(topAirlines) &&
              <div className="card !p-4 mb-4">
                <RankingBarChart data={topAirlines}/>
              </div>
            }

            <DataBlock data={topAirlines}/>

          </Section>



          <Section title="Top routes">

            {
              canChart(topRoutes) &&
              <div className="card !p-4 mb-4">
                <RankingBarChart data={topRoutes}/>
              </div>
            }

            <DataBlock data={topRoutes}/>

          </Section>



          <Section title="Top customers">

            {
              canChart(topUsers) &&
              <div className="card !p-4 mb-4">
                <RankingBarChart data={topUsers}/>
              </div>
            }

            <DataBlock data={topUsers}/>

          </Section>


        </>

      }

    </div>

  )

}