import React from 'react';
import '../css/detail.css';
import { useLocation } from 'react-router-dom';

function Detail(){

    const location = useLocation();
    const address = location.state?.address;

    console.log('location state : ', address);

    const { kakao } = window;

    var container = document.getElementById('map');
    var options = {
    center: new kakao.maps.LatLng( address[0].y, address[0].x ),
    level: 4
    };

    var map = new kakao.maps.Map(container, options);

    if( address != undefined ){

        var clusterer = new kakao.maps.MarkerClusterer({
            map: map,
            markers: marker,
            gridSize: 35,
            averageCenter: true,
            minLevel: 6,
            disableClickZoom: true,
            styles: [{
                width : '53px', height : '52px',
                background: 'url(cluster.png) no-repeat',
                color: '#fff',
                textAlign: 'center',
                lineHeight: '54px'
            }]
        });
    
        var bounds = new kakao.maps.LatLngBounds();
    
        for(const latLng of address){
    
            var point = new kakao.maps.LatLng( latLng.y, latLng.x );
            var marker = new kakao.maps.Marker({
            position: point
            });  
    
            bounds.extend(point);
            clusterer.addMarker(marker);
        }
    
        map.setBounds(bounds);
    }

    return(
        <>        
            { address == undefined ? <div className="detail-address"></div> : null }
        </>
    )
}

export default Detail;