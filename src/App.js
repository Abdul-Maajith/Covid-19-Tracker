import React, { useState, useEffect } from 'react';
import { Select, FormControl, MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from "./InfoBox"
import Map from "./Map"
import Table from "./Table"
import { sortData, prettyPrintStat } from "./util"
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css";

function App() {

  const countriesUrl = "https://api.caw.sh/v3/covid-19/countries"
  const [countries, setCountries ] = useState([]);
  const [selectcountry, setSelectcountry ] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const[tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.1025 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://api.caw.sh/v3/covid-19/all")
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      const res = await fetch(countriesUrl);
      const data = await res.json();
      const countries = data.map((country) => (
        {
          key:country.updated,
          name: country.country,
          value: country.countryInfo.iso2,
        }
      ));

      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
      setMapCountries(data);
      console.log(data);
    };

    getCountriesData();
  }, [])

  const onCountryChange = async(e) => {
    const countryCode = e.target.value;

    const url = countryCode === "Worldwide" 
      ? "https://api.caw.sh/v3/covid-19/all" 
      : `https://api.caw.sh/v3/covid-19/countries/${countryCode}?strict=true`
    
    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setSelectcountry(countryCode);
      // All of the data of the country!
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
         <h1>Covid-19 Tracker</h1>
         <FormControl className="app__dropdown">
           <Select
             variant="outlined"
             onChange={onCountryChange}
             value={selectcountry}
           >
             <MenuItem value="Worldwide">
                Worldwide
              </MenuItem>
             {countries.map((country) => (
              <MenuItem value={country.value} key={country.updated}>
                {country.name}
              </MenuItem>
            ))}
            </Select>

         </FormControl>
        </div>

       <div className="app__stats">
         <InfoBox 
         isRed
         onClick={(e) => setCasesType("cases")}
         active={casesType === "cases"}
         title="Coronavirus Cases" 
         cases={prettyPrintStat(countryInfo.todayCases)} 
         total={prettyPrintStat(countryInfo.cases)} 
         />

         <InfoBox 
         onClick={(e) => setCasesType("recovered")}
         active={casesType === "recovered"}
         title="Recovered" 
         cases={prettyPrintStat(countryInfo.todayRecovered)} 
         total={prettyPrintStat(countryInfo.recovered)}
         />

         <InfoBox
         isRed
         onClick={(e) => setCasesType("deaths")}
         active={casesType === "deaths"}
         title="Deaths" 
         cases={prettyPrintStat(countryInfo.todayDeaths)} 
         total={prettyPrintStat(countryInfo.deaths)}
         />
       </div>

       {/* Map */}
       <Map 
        center={mapCenter}
        zoom={mapZoom}
        countries={mapCountries}
        casesType={casesType}
       />

      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}/>

          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />

        </CardContent>
      </Card>

    </div>
  );
}

export default App;
