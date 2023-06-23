import { useEffect } from "react";
import '../css/kakaoMap.css';

function KakaoMap(){

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
        <div className="map-container">
            <div id="map"></div>
        </div>
    )
}

export default KakaoMap;