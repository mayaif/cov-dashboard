import Select from 'react-select'
import {useState, useEffect} from 'react'
import './App.css';
import Card from './SummaryCard';
function App() {

  const locationList = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" },
  ];

  const [activeLocation, setActiveLocation] = useState("AB")
  const [lastUpdated, setLastUpdated] = useState("")
  const [summaryData, setSummaryData] = useState({})

  const baseUrl = "https://api.opencovid.ca"

  //fetching lastUpdated
  const getVersion = async () => {
    const res = await fetch(`${baseUrl}/version`)
    const data = await res.json()
    setLastUpdated(data.timeseries)
  }

  //fetching summary data
  const getSummaryData = async (location) => {
    if(activeLocation === "canada") {
      return
    }

    //data is fetched by making a call to the /summary endpoint with the loc parameter set to activeLocation
    //To get the summary location for a paticular location, a loc parameter can be added to the url along with the endpoint ( e.g. /summary?loc=AB)
    let res = await fetch(`${baseUrl}/summary?loc=${activeLocation}`)
    let resData = await res.json()
    let summaryData =  resData.data[0]
    let formattedData = {}
    Object.keys(summaryData).map(key => (formattedData[key] = summaryData[key].toLocaleString()))
    console.log(formattedData)
    //state update with the formatted data
    setSummaryData(formattedData)
  }
  
  //useEffect allows functions to be called after component re-renders.
  useEffect(() => {
    getVersion()
    getSummaryData()
  }, [activeLocation])


  return (
    <div className="App">
    <h1>Covid 19 DashBoard</h1>
    <div className='dashboard-container'>
      <div className='dashboard-menu'>
        <Select 
          options={locationList}
          //Storing active location
          onChange = {(selectedOption => setActiveLocation(selectedOption.value))}
          defaultValue={locationList.filter(options => options.value === activeLocation)}
          className="dashboard-select"
        />
      <p className='update-date'>Last Updated: {lastUpdated}</p>
      </div>
      <div className='dashboard-summary'>
        <Card title="Total Cases" value={summaryData.cases} />
        <Card
            title="Total Tests"
            value={summaryData.tests_completed}
        />
        <Card title="Total Deaths" value={summaryData.deaths} />
        <Card
            title="Total Vaccinated"
            value={summaryData.vaccine_administration_total_doses}
        />
      </div>
    </div> 
    </div>
  );
}

export default App;
