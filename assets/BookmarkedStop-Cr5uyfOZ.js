import{a3 as S,a4 as h,r as a,ad as g,a8 as f,j as s,Z as m,F as T,a5 as j,a9 as k}from"./index-CV5O0rXO.js";import{N as v,B as w,D as R}from"./NoticeCard-Dglla2zX.js";import{T as y,a as L,P as M}from"./App-Da0eBMSb.js";import{S as B}from"./index-5NTwTKvE.js";import{S as I}from"./StopRouteList-CVFR-5S2.js";import"./CircularProgress--CdaR6lU.js";const $=({stopTab:u,onChangeTab:r})=>{const{t:l}=S(),p=h(),{savedStops:i}=a.useContext(g),{db:{stopList:c}}=a.useContext(f);return i.length===0?s.jsxs(s.Fragment,{children:[s.jsx(m,{variant:"h6",children:l("未有收藏車站")}),s.jsx(m,{variant:"body1",children:l("請按下圖指示增加")})]}):s.jsx(y,{value:u,onChange:(t,n)=>r(n,!0),sx:D,variant:"scrollable",scrollButtons:!0,children:i.map(t=>t.split("|")).filter(([,t])=>c[t]).map(([t,n])=>s.jsx(L,{label:c[n].name[p],value:`${t}|${n}`,disableRipple:!0},`stops-${n}`))})},D={background:u=>u.palette.background.default,minHeight:"36px","& .MuiTab-root":{alignItems:"center",justifyContent:"center",paddingTop:0,paddingBottom:0,minHeight:"32px"},"& .MuiTabs-flexContainer":{justifyContent:"flex-start"}},E=T.forwardRef(({stopTab:u,onChangeTab:r},l)=>{const{savedStops:p}=a.useContext(g),{db:{stopList:i,stopMap:c}}=a.useContext(f),t=a.useRef(u);a.useImperativeHandle(l,()=>({changeTab:e=>{t.current=e}}));const n=a.useMemo(()=>p.filter(e=>e.split("|")[1]in i),[p,i]),d=a.useCallback(()=>{let e=n.indexOf(t.current);return e!==-1?e:-1},[n]),b=a.useMemo(()=>n.map(e=>{var x;if(e==="")return[];const o=[e.split("|")];return(x=c[o[0][1]])==null||x.forEach(C=>o.push(C)),o}),[n,c]);return s.jsx(B,{index:d(),onChangeIndex:e=>{r(n[e])},children:b.map((e,o)=>s.jsx(I,{stops:e,isFocus:d()===o},`savedStops-${o}`))})}),z=()=>{const{colorMode:u}=a.useContext(j),{savedStops:r}=a.useContext(g),{db:{stopList:l}}=a.useContext(f),p=h(),i=a.useRef(null),c=a.useMemo(()=>{try{const e=localStorage.getItem("stopTab")??"|";if(e&&r.includes(e)&&l[e.split("|")[1]])return e;for(let o=0;o<r.length;++o){let x=r[o].split("|")[1];if(l[x])return r[o]}}catch(e){console.error(e)}return""},[r,l]),[t,n]=a.useState(c),d=a.useCallback(e=>t===""?"unset":e.palette.mode==="dark"?e.palette.background.default:"white",[t]);a.useEffect(()=>{localStorage.setItem("stopTab",t)},[t]);const b=a.useCallback(e=>{var o;n(e),(o=i.current)==null||o.changeTab(e)},[]);return s.jsxs(M,{sx:{...F,bgcolor:d,backgroundImage:t===""?`url(/img/stop-bookmark-guide-${u}-${p}.png)`:"unset",opacity:t===""?"0.8":"unset"},square:!0,elevation:0,children:[s.jsx($,{stopTab:t,onChangeTab:b}),s.jsx(v,{}),s.jsx(w,{}),s.jsx(R,{}),s.jsx(k,{sx:{flex:1,overflow:"scroll"},children:s.jsx(E,{ref:i,stopTab:t,onChangeTab:b})})]})},F={textAlign:"center",display:"flex",flexDirection:"column",overflow:"auto",width:"100%",flex:1,backgroundSize:"contain",backgroundPosition:"center",backgroundRepeat:"no-repeat"};export{z as default};
