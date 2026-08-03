import { useState, useEffect } from 'react'

import { searchFlights, listFlights } from '../../api/flights'
import { listAirlines } from '../../api/airlines'
import { getCustomerDashboard } from '../../api/dashboard'

import FlightCard from '../../components/FlightCard'
import Loader from '../../components/Loader'
import { apiErrorMessage } from '../../utils/helpers'


export default function Home() {

  const [form, setForm] = useState({
    origin: '',
    destination: '',
    date: ''
  })


  const [flights, setFlights] = useState([])
  const [airlines, setAirlines] = useState([])

  const [stats, setStats] = useState({
    flights: 0,
    airlines: 0,
    destinations: 0
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)


  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }


  const onSearch = async (e) => {

    e.preventDefault()

    setError('')
    setLoading(true)
    setSearched(true)

    try {

      const response = await searchFlights(
        form.origin.trim(),
        form.destination.trim(),
        form.date
      )


      console.log("SEARCH DATA:", response.data)

setFlights(response.data)


    } catch (err) {

      console.log("SEARCH ERROR:", err)

      setError(
        apiErrorMessage(err)
      )

      setFlights([])

    } finally {

      setLoading(false)

    }

  }



  const browseAll = async () => {

    setError('')
    setLoading(true)
    setSearched(true)


    try {

      const response = await listFlights({

        page: 1,
        page_size: 20,
        sort_by: 'departure_time'

      })


      setFlights(
        response.data.items || []
      )


    } catch (err) {

      setError(
        apiErrorMessage(err)
      )

    } finally {

      setLoading(false)

    }

  }




  useEffect(() => {


    const loadHomeData = async () => {


      try {


        const airlineResponse = await listAirlines({

          page: 1,
          page_size: 6

        })


        setAirlines(
          airlineResponse.data.items || []
        )



        const dashboardResponse =
          await getCustomerDashboard()



        const dashboard =
          dashboardResponse.data



        setStats({

          flights:
            dashboard.total_flights || 0,


          airlines:
            dashboard.total_airlines || 0,


          destinations:
            dashboard.total_destinations || 0

        })


      } catch (err) {

        console.log(
          "Home data error:",
          err
        )

      }


    }


    loadHomeData()


  }, [])



  return (

    <div className="min-h-screen bg-slate-50">


      <section className="relative overflow-hidden bg-navy-900">


        <div className="
          absolute
          inset-0
          bg-gradient-to-br
          from-blue-900
          via-navy-900
          to-black
          opacity-90
        " />


        <div className="
          relative
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          py-20
        ">


          <div className="max-w-3xl">


            <p className="
              text-amber-400
              uppercase
              tracking-widest
              text-sm
              font-semibold
            ">
              Global Flight Booking
            </p>


            <h1 className="
              mt-4
              text-4xl
              sm:text-6xl
              font-bold
              text-white
              leading-tight
            ">

              Explore the world with

              <span className="text-amber-400">
                {" "}smart flight booking
              </span>

            </h1>


          </div>



          <form
            onSubmit={onSearch}
            className="
              mt-10
              bg-white/95
              rounded-3xl
              shadow-2xl
              p-5
              grid
              md:grid-cols-4
              gap-4
            "
          >


            <div>

              <label className="label">
                From
              </label>


              <input
                required
                name="origin"
                value={form.origin}
                onChange={onChange}
                placeholder="Dhaka / DAC"
                className="input"
              />

            </div>



            <div>

              <label className="label">
                To
              </label>


              <input
                required
                name="destination"
                value={form.destination}
                onChange={onChange}
                placeholder="Dubai / DXB"
                className="input"
              />

            </div>



            <div>

              <label className="label">
                Departure
              </label>


              <input
                required
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                className="input"
              />

            </div>



            <div className="flex items-end">

              <button
                type="submit"
                className="
                  btn
                  btn-amber
                  w-full
                  h-12
                  rounded-xl
                "
              >

                Search Flights

              </button>

            </div>


          </form>


          <button
            onClick={browseAll}
            className="
              mt-5
              text-white/70
              hover:text-white
              underline
            "
          >

            Browse all upcoming flights

          </button>


        </div>


      </section>

      {/* Search Results Section - Moved right after search */}
      {searched && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {loading && (
            <Loader label="Searching flights..." />
          )}



          {!loading && error && (

            <div className="card text-red-600">
              {error}
            </div>

          )}



          {!loading &&
            !error &&
            flights.length === 0 && (

            <div className="card text-center">
              No flights found.
            </div>

          )}




          {flights.length > 0 && (

            <div className="space-y-5">


              <h2 className="text-2xl font-bold">
                Available Flights
              </h2>



              {flights.map((flight) => (

  <div key={flight.id}>

    <h2>
      TEST: {flight.flight_number}
    </h2>

    <FlightCard
      flight={flight}
    />

  </div>

))}

            </div>

          )}


        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

        <div className="text-center mb-10">

          <p className="text-amber-500 uppercase tracking-widest text-sm font-semibold">
            Popular Routes
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Explore Popular Destinations
          </h2>

          <p className="text-slate-500 mt-3">
            Discover amazing places with affordable flight options.
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              code: "DXB",
              name: "Dubai",
              desc: "Business and luxury destination."
            },
            {
              code: "BKK",
              name: "Bangkok",
              desc: "Enjoy culture and beautiful beaches."
            },
            {
              code: "IST",
              name: "Istanbul",
              desc: "History meets modern lifestyle."
            }

          ].map((item)=>(

            <div
              key={item.code}
              className="rounded-3xl overflow-hidden shadow-lg bg-white"
            >

              <div className="
                h-48
                bg-gradient-to-br
                from-blue-600
                to-navy-900
                flex
                items-center
                justify-center
              ">

                <span className="text-white text-4xl font-bold">
                  {item.code}
                </span>

              </div>


              <div className="p-6">

                <h3 className="text-xl font-bold">
                  {item.name}
                </h3>

                <p className="text-slate-500 mt-2">
                  {item.desc}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>



      <section className="bg-white py-16">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">

            <p className="text-amber-500 uppercase tracking-widest text-sm">
              Partner Airlines
            </p>

            <h2 className="text-3xl font-bold mt-3">
              Top Airlines
            </h2>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {airlines.map((airline)=>(

              <div
                key={airline.id}
                className="bg-slate-50 rounded-2xl p-6 shadow-sm"
              >

                <h3 className="text-xl font-bold">
                  {airline.name}
                </h3>

                <p className="text-slate-500 mt-2">
                  {airline.iata_code}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>




      <section className="bg-navy-900 py-14">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-6
            text-center
            text-white
          ">


            <div>
              <h3 className="text-4xl font-bold text-amber-400">
                {stats.flights}+
              </h3>
              <p className="text-white/70">
                Flights
              </p>
            </div>


            <div>
              <h3 className="text-4xl font-bold text-amber-400">
                {stats.airlines}+
              </h3>
              <p className="text-white/70">
                Airlines
              </p>
            </div>


            <div>
              <h3 className="text-4xl font-bold text-amber-400">
                {stats.destinations}+
              </h3>
              <p className="text-white/70">
                Destinations
              </p>
            </div>


            <div>
              <h3 className="text-4xl font-bold text-amber-400">
                24/7
              </h3>
              <p className="text-white/70">
                Support
              </p>
            </div>


          </div>

        </div>

      </section>




      <footer className="bg-black text-white py-10">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">


          <h3 className="text-xl font-bold text-amber-400">
            AirTicket
          </h3>


          <p className="text-white/60 mt-3">
            Your trusted platform for worldwide flight booking.
          </p>



          <div className="
            border-t
            border-white/10
            mt-8
            pt-5
            text-center
            text-white/50
          ">

            © 2026 AirTicket. All rights reserved.

          </div>


        </div>


      </footer>


    </div>

  )

}