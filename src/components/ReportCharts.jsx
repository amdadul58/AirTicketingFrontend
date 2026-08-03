import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'


const COLORS = [
  '#0B1D33',
  '#E8A33D',
  '#2F5D8A',
  '#1E8E5A',
  '#C1443C',
  '#F0B759'
]


function normalizeData(data) {

  if (!data) return []

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.series)) {
    return data.series
  }

  return []
}



function detectFields(rows) {

  if (
    !Array.isArray(rows) ||
    !rows.length ||
    typeof rows[0] !== 'object'
  ) {
    return null
  }


  const keys = Object.keys(rows[0])


  let numericKey =
    [
      'revenue',
      'total_revenue',
      'booking_count',
      'total_spent',
      'count',
      'amount'
    ]
    .find(key => keys.includes(key))


  let labelKey =
    [
      'date',
      'name',
      'status',
      'origin',
      'destination',
      'full_name',
      'email'
    ]
    .find(key => keys.includes(key))


  if (!numericKey || !labelKey) {
    return null
  }


  return {
    numericKey,
    labelKey
  }

}



export function canChart(data) {

  return detectFields(normalizeData(data)) !== null

}



function shortLabel(value) {

  const text = String(value)

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0,10)
  }

  return text.length > 14
    ? `${text.slice(0,12)}…`
    : text

}





export function RevenueChart({data}) {

  const rows = normalizeData(data)

  const fields = detectFields(rows)


  if (!fields) return null



  const chartData = rows.map(row => ({

    ...row,

    __label: shortLabel(row[fields.labelKey]),

    [fields.numericKey]:
      Number(row[fields.numericKey] || 0)

  }))



  return (

    <ResponsiveContainer width="100%" height={260}>

      <LineChart data={chartData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="__label" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey={fields.numericKey}
          stroke="#E8A33D"
          strokeWidth={3}
          dot={{r:4}}
        />

      </LineChart>

    </ResponsiveContainer>

  )

}export function StatusPieChart({data}) {

  const rows = normalizeData(data)

  const fields = detectFields(rows)


  if (!fields) return null



  const chartData = rows.map(row => ({

    ...row,

    [fields.numericKey]:
      Number(row[fields.numericKey] || 0)

  }))



  return (

    <ResponsiveContainer width="100%" height={260}>

      <PieChart>

        <Pie
          data={chartData}
          dataKey={fields.numericKey}
          nameKey={fields.labelKey}
          outerRadius={90}
          label
        >

          {
            chartData.map((_, index)=>(

              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />

            ))
          }

        </Pie>


        <Tooltip />

        <Legend />


      </PieChart>

    </ResponsiveContainer>

  )

}





export function RankingBarChart({data}) {

  const rows = normalizeData(data)


  if (!rows.length) return null



  const keys = Object.keys(rows[0])



  let labelKey = null

  let numericKey = null



  // Route
  if (
    keys.includes('origin') &&
    keys.includes('destination')
  ) {

    rows.forEach(row => {

      row.route_label =
        `${row.origin} → ${row.destination}`

    })


    labelKey = 'route_label'

  }


  // Airline
  else if (keys.includes('name')) {

    labelKey = 'name'

  }


  // Customer
  else if (keys.includes('full_name')) {

    labelKey = 'full_name'

  }


  else if (keys.includes('email')) {

    labelKey = 'email'

  }



  // Value

  if (keys.includes('booking_count')) {

    numericKey = 'booking_count'

  }

  else if (keys.includes('total_spent')) {

    numericKey = 'total_spent'

  }

  else if (keys.includes('revenue')) {

    numericKey = 'revenue'

  }



  if (!labelKey || !numericKey) {
    return null
  }




  const chartData = rows.map(row => ({

    ...row,

    __label: shortLabel(row[labelKey]),

    [numericKey]:
      Number(row[numericKey] || 0)

  }))



  return (

    <ResponsiveContainer
      width="100%"
      height={Math.max(220, chartData.length * 42)}
    >

      <BarChart
        data={chartData}
        layout="vertical"
      >


        <CartesianGrid strokeDasharray="3 3" />


        <XAxis type="number" />


        <YAxis
          type="category"
          dataKey="__label"
          width={150}
        />


        <Tooltip />


        <Bar
          dataKey={numericKey}
          fill="#0B1D33"
          radius={[0,4,4,0]}
          minPointSize={5}
        />


      </BarChart>


    </ResponsiveContainer>

  )

}