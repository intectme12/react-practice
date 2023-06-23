import React, { useEffect } from "react";
import '../css/sidebar.css';
import '../css/detail.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SideBar(){

    const { kakao } = window;
  
    const [ keyword, setKeyword ] = useState('');
    const [ suggestion, setSuggestion ] = useState(false);
    const [ address, setAdress ] = useState([]);
    const [ markers, setMarkers ] =useState(false);

    const navigate = useNavigate();
  
    const handleOnFocus = () => {
        address != [] ? setSuggestion(true) : setSuggestion(false);
    };
  
    const handleOnBlur = () => {
  
        // 기본적으로 blur 는 setSuggestion을 false
        // address 에 데이터가 있으면 true
        // suggestion을 클릭하면 setMarker를 작업하고 false가 되어야함
        address != [] ? setSuggestion(true) : setSuggestion(false);
    };
  
    const handleOnChange = (e) => {
      setKeyword(e.target.value);
    }

    useEffect(()=>{
  
      // address를 검색할 수 있는 객체 생성
      var place = new kakao.maps.services.Places();
      // 입력한 keyword가 비어 있으면 주소 입력값 상태를 배열 공백 상태로 만들어준다.
      // 그래야 suggestion 컴포넌트에서 검색할 주소가 없다고 출력할 수 있다.
      if(keyword == ''){
        setAdress([]);
        setMarkers(false);
      }
  
      // keyword 입력값에 따른 결과값을 callback 함수로 result에 받아온다.
      // 이후 adress에 결과 값을 넣어준다.
      var callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            setAdress(result);
        } 
      };
  
      place.keywordSearch(keyword, callback);
      // keyword 의존성 주입을 해줌. onChange를 통해 keyword가 입력될 때 마다 관련된 새로운 주소값을 suggestion에 뿌려주기 위함.

      return ()=>{
        setMarkers(false);
      }
    },[keyword]);
  
    return(
        <>
            <div className="sidebar" id="menu_wrap">
                {/* inputValue에 밸류값을 입력하면 그 입력값을 useState에 담고 그 input에 onchange가 될때마다 검색된 주소명을 
                    Suggestion에 뿌려준다. map을 통해 카카오 주소 get요청을 통해 받아온 결과값을 아래쪽으로 나열해준다. */}
                    <input className="keyword" placeholder="위치를 검색하세요." onChange={ handleOnChange } onFocus={ handleOnFocus } onBlur={ handleOnBlur }></input>  
                    {/* 검색을 누르면 address를 반복문으로 x, y의 좌표기준으로 marker를 찍는다. */}
                    <button className="find-keyword" onClick={()=>{setMarkers(true)}}>검색</button>
            </div>
            {/* keyword를 통해 설정된 address값을 suggestion에 props로 전달. */}
            { suggestion == true ? <Suggestion address={address}/> : null }
            { markers == true ? <Detail address={address}/> : null }
        </>
    )
  
    function Suggestion(props){
  
      const [ marker, setMarker ] = useState({});
      const [ mapLoaded, setMapLoded ] = useState(false);
      const x = marker.x;
      const y = marker.y;        
      const navigate = useNavigate();


        var container = document.getElementById('map');
        var options = {
        center: new kakao.maps.LatLng( y, x ),
        level: 2
        };
    
        var map = new kakao.maps.Map(container, options);

      useEffect(()=>{

          if(x != undefined && y != undefined ){

            console.log(map);
        
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
        
            var marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng( y, x )
            });
            
            clusterer.addMarker(marker);
          }
      },[marker])
      
        return(
            <div className="suggestion-container">
                { props.address == '' ? <div className="suggestion">검색한 주소가 없습니다.</div> : 
                  props.address.map((address, index)=>{
                    return(
                      <div className="suggestion" key={index} onClick={()=>{ setMarker(props.address[index]);}}>
                        <span>{props.address[index].address_name}, </span>
                        <span>{props.address[index].place_name}</span>
                      </div>
                    )
                  })
                }
            </div>
        )
    }
  }

  function Detail(props){

    const { kakao } = window;

    console.log(props.address);

    if( props.address != undefined ){

        var container = document.getElementById('map');
        var options = {
        center: new kakao.maps.LatLng( props.address[0].y, props.address[0].x ),
        level: 4
        };

        var map = new kakao.maps.Map(container, options);

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
    
        for(const latLng of props.address){
    
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
            { props.address == undefined ? <div className="detail-address"></div> : null }
        </>
    )
}

export default SideBar;