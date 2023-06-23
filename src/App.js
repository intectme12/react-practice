import './App.css';
import { useEffect } from "react";
import './css/kakaoMap.css';
import SideBar from './components/sidebar.js';
import Detail from './components/detail.js';
import { Route, Routes } from 'react-router-dom';

function App() {

  const { kakao } = window;

  useEffect(()=>{

      var container = document.getElementById('map');
      var options = {
      center: new kakao.maps.LatLng(37.5665, 126.9784),
      level: 11
      };

      var map = new kakao.maps.Map(container, options);
     
  },[])

  return (
    <div className="App">
      <KakaoMap></KakaoMap>
      <SideBar></SideBar>
    </div>
  );
}

function KakaoMap(){

  return (
      <div className="map-container">
          <div id="map"></div>
      </div>
  )
}

export default App;
