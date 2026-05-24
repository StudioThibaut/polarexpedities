// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ROUTE: [number,number][] = [
  [4.40,51.22],[1.80,50.10],[-5.00,47.50],[-9.10,38.70],
  [-17.00,28.00],[-22.00,15.00],[-26.00,3.00],[-33.00,-14.00],
  [-38.00,-22.00],[-43.10,-22.90],[-48.00,-28.00],[-57.00,-40.00],
  [-60.00,-49.00],[-64.50,-56.00],[-63.00,-59.00],[-61.50,-62.00],
  [-64.50,-64.80],[-72.00,-67.50],[-85.00,-70.50],[-88.00,-71.00],
];

function haversine(a:[number,number],b:[number,number]):number{
  const R=6371,r=(d:number)=>d*Math.PI/180;
  const dl=r(b[1]-a[1]),dg=r(b[0]-a[0]);
  return 2*R*Math.asin(Math.sqrt(Math.sin(dl/2)**2+Math.cos(r(a[1]))*Math.cos(r(b[1]))*Math.sin(dg/2)**2));
}
function buildTimes(pts:[number,number][]):number[]{
  const d=[0];for(let i=1;i<pts.length;i++)d.push(d[i-1]+haversine(pts[i-1],pts[i]));
  const tot=d[d.length-1];return d.map(x=>x/tot);
}
const TIMES=buildTimes(ROUTE);
function lp(a:number,b:number,t:number){return a+(b-a)*t;}
function getPoint(t:number):[number,number]{
  if(t<=0)return ROUTE[0];if(t>=1)return ROUTE[ROUTE.length-1];
  let i=TIMES.findIndex(ti=>ti>=t);if(i<=0)i=1;
  const a=ROUTE[i-1],b=ROUTE[i],lo=(t-TIMES[i-1])/(TIMES[i]-TIMES[i-1]);
  return[lp(a[0],b[0],lo),lp(a[1],b[1],lo)];
}
function buildDrawn(t:number):[number,number][]{
  if(t<=0)return[];
  const pts:[number,number][]=[];
  for(let i=0;i<ROUTE.length;i++){
    if(TIMES[i]<=t)pts.push(ROUTE[i]);
    else{pts.push(getPoint(t));break;}
  }
  return pts;
}

// Perkament stofdeeltjes
const PARTICLES=Array.from({length:90},(_,i)=>({
  x:(i*41+7)%100, y:(i*67+13)%100,
  size:i%7===0?3.5:i%3===0?2:1.2,
  dur:3+(i%9)*1.4, delay:i*0.16,
}));

type Lang = "nl" | "en" | "fr";

const AT = {
  nl: {
    label:   "België · Interactieve installatie",
    titel1:  "Belgische",
    titel2:  "Poolexpedities",
    sub:     "Antarctica · 1897 – heden · Drie expedities",
    touch:   "Raak het scherm aan om te beginnen",
    exp1:"De Belgica",      jaar1:"1897 – 1899",
    exp2:"Boudewijn-basis", jaar2:"1957 – 1967",
    exp3:"Princess Elisabeth",jaar3:"2009 – heden",
    quote:   "De kaden stonden vol volk. Niemand wist of we ooit zouden terugkeren.",
    quoteBy: "— Adrien de Gerlache, 16 augustus 1897",
  },
  en: {
    label:   "Belgium · Interactive installation",
    titel1:  "Belgian",
    titel2:  "Polar Expeditions",
    sub:     "Antarctica · 1897 – present · Three expeditions",
    touch:   "Touch the screen to begin",
    exp1:"The Belgica",     jaar1:"1897 – 1899",
    exp2:"Baudouin Base",   jaar2:"1957 – 1967",
    exp3:"Princess Elisabeth",jaar3:"2009 – present",
    quote:   "The quays were packed with people. Nobody knew whether we would ever return.",
    quoteBy: "— Adrien de Gerlache, 16 August 1897",
  },
  fr: {
    label:   "Belgique · Installation interactive",
    titel1:  "Expéditions",
    titel2:  "Polaires Belges",
    sub:     "Antarctique · 1897 – présent · Trois expéditions",
    touch:   "Touchez l'écran pour commencer",
    exp1:"La Belgica",      jaar1:"1897 – 1899",
    exp2:"Base Baudouin",   jaar2:"1957 – 1967",
    exp3:"Princess Elisabeth",jaar3:"2009 – présent",
    quote:   "Les quais étaient bondés. Personne ne savait si nous reviendrions un jour.",
    quoteBy: "— Adrien de Gerlache, 16 août 1897",
  },
};

export default function AttractMode(){
  const lang: Lang = "nl";
  const router=useRouter();
  const t=AT[lang]??AT.nl;
  const [progress,setProgress]=useState(0);
  const [rotate,setRotate]=useState<[number,number,number]>([-4.4,-51.2,0]);
  const [mounted,setMounted]=useState(false);
  const [phase,setPhase]=useState<"draw"|"hold"|"fade">("draw");
  const [tick,setTick]=useState(0);

  const progRef=useRef(0);
  const phaseRef=useRef<"draw"|"hold"|"fade">("draw");
  const holdTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const rafRef=useRef<number|null>(null);
  const targetR=useRef<[number,number,number]>([-4.4,-51.2,0]);
  const currentR=useRef<[number,number,number]>([-4.4,-51.2,0]);
  const rotRef=useRef<number|null>(null);

  useEffect(()=>{
    const hide=(s:string)=>document.querySelectorAll(s).forEach(el=>((el as HTMLElement).style.display="none"));
    hide("footer");hide("header");hide("nav");
    document.body.style.overflow="hidden";
    document.body.style.background="#E8D4A0";
    document.documentElement.style.overflow="hidden";
    setTimeout(()=>setMounted(true),120);
    return()=>{
      document.querySelectorAll("footer,header,nav").forEach(el=>((el as HTMLElement).style.display=""));
      document.body.style.overflow="";document.body.style.background="";
    };
  },[]);

  useEffect(()=>{
    const go=()=>{
      const[tx,ty]=targetR.current,[cx,cy,cz]=currentR.current;
      let dx=tx-cx;while(dx>180)dx-=360;while(dx<-180)dx+=360;
      const dy=ty-cy,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist>0.04){
        const s=Math.min(1.2,dist*0.08)/dist;
        const nr:[number,number,number]=[cx+dx*s,cy+dy*s,cz];
        currentR.current=nr;setRotate(nr);
      }
      rotRef.current=requestAnimationFrame(go);
    };
    rotRef.current=requestAnimationFrame(go);
    return()=>{if(rotRef.current)cancelAnimationFrame(rotRef.current);};
  },[]);

  useEffect(()=>{
    const SPEED=0.00065;
    const anim=()=>{
      if(phaseRef.current==="draw"){
        progRef.current=Math.min(1,progRef.current+SPEED);
        setProgress(progRef.current);
        const pt=getPoint(progRef.current);
        targetR.current=[-pt[0],-pt[1],0];
        if(progRef.current>=1){
          phaseRef.current="hold";setPhase("hold");
          holdTimer.current=setTimeout(()=>{
            phaseRef.current="fade";setPhase("fade");
            setTimeout(()=>{
              progRef.current=0;phaseRef.current="draw";setPhase("draw");
              setProgress(0);targetR.current=[-ROUTE[0][0],-ROUTE[0][1],0];
            },1600);
          },4500);
        }
      }
      rafRef.current=requestAnimationFrame(anim);
    };
    rafRef.current=requestAnimationFrame(anim);
    return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);if(holdTimer.current)clearTimeout(holdTimer.current);};
  },[]);

  useEffect(()=>{
    const id=setInterval(()=>setTick(t=>t+1),900);
    return()=>clearInterval(id);
  },[]);

  const pulse=tick%2===0;
  const shipPos=getPoint(progress);
  const drawn=buildDrawn(progress);
  const isFading=phase==="fade";
  const handleTouch=()=>{router.push("/home");router.push("/home");};

  const EXPS=[
    {k:"#C8A85A",naam:t.exp1,jaar:t.jaar1},
    {k:"#7A9E5A",naam:t.exp2,jaar:t.jaar2},
    {k:"#E8934A",naam:t.exp3,jaar:t.jaar3},
  ];

  return(
    <div onClick={handleTouch}
      style={{position:"fixed",inset:0,zIndex:9999,
        background:"#E8D4A0",
        cursor:"pointer",overflow:"hidden",
        opacity:mounted?1:0,transition:"opacity 1.4s ease",
        fontFamily:"'DM Sans',system-ui,sans-serif"}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,300;1,400;1,700&family=JetBrains+Mono:wght@200;300;400&display=swap');

        @keyframes particle { 0%,100%{opacity:0;transform:translateY(0)} 50%{opacity:.6;transform:translateY(-8px)} }
        @keyframes ping     { 0%,100%{transform:scale(1);opacity:.5} 60%{transform:scale(3.2);opacity:0} }
        @keyframes ping2    { 0%,100%{transform:scale(1);opacity:.3} 60%{transform:scale(2.5);opacity:0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes breathe  { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.18)} }
        @keyframes goldLine { 0%,100%{opacity:.30} 50%{opacity:.70} }
        @keyframes drift    { 0%,100%{transform:translate(0,0)} 33%{transform:translate(10px,-6px)} 66%{transform:translate(-6px,8px)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes inkspot  { 0%,100%{opacity:.03;transform:scale(1)} 50%{opacity:.08;transform:scale(1.06)} }
        @keyframes float    { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }

        .ping    { animation: ping   3.5s ease-in-out infinite }
        .ping2   { animation: ping2  3.5s 1s ease-in-out infinite }
        .breathe { animation: breathe 2.6s ease-in-out infinite }
        .goldLine{ animation: goldLine 4s ease-in-out infinite }
        .drift   { animation: drift  11s ease-in-out infinite }
        .float   { animation: float   6s ease-in-out infinite }

        .f1{animation:fadeUp 1.3s .00s cubic-bezier(.22,1,.36,1) both}
        .f2{animation:fadeUp 1.3s .18s cubic-bezier(.22,1,.36,1) both}
        .f3{animation:fadeUp 1.3s .36s cubic-bezier(.22,1,.36,1) both}
        .f4{animation:fadeUp 1.3s .54s cubic-bezier(.22,1,.36,1) both}
        .f5{animation:fadeUp 1.3s .72s cubic-bezier(.22,1,.36,1) both}
        .f6{animation:fadeUp 1.3s .90s cubic-bezier(.22,1,.36,1) both}

        .shimmer {
          background: linear-gradient(90deg,#8B4A10 0%,#C8A85A 35%,#E8CC80 50%,#C8A85A 65%,#8B4A10 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 7s linear infinite;
        }
      `}</style>

      {/* Perkament stofdeeltjes */}
      {PARTICLES.map((p,i)=>(
        <div key={i} style={{position:"absolute",
          left:`${p.x}%`,top:`${p.y}%`,
          width:p.size,height:p.size,borderRadius:"50%",
          background:"rgba(139,74,16,.40)",pointerEvents:"none",
          animation:`particle ${p.dur}s ${p.delay}s ease-in-out infinite`,opacity:0}}/>
      ))}

      {/* Atmosferische inktvlekken — perkament sfeer */}
      <div className="drift" style={{position:"absolute",top:"-15%",left:"-10%",
        width:"60vw",height:"60vw",borderRadius:"50%",pointerEvents:"none",
        background:"radial-gradient(circle,rgba(139,74,16,.06) 0%,transparent 65%)",
        animation:"inkspot 8s ease-in-out infinite"}}/>
      <div className="drift" style={{position:"absolute",bottom:"-20%",right:"-8%",
        width:"50vw",height:"50vw",borderRadius:"50%",pointerEvents:"none",
        background:"radial-gradient(circle,rgba(100,50,10,.05) 0%,transparent 65%)",
        animationDelay:"4s",animation:"inkspot 10s 4s ease-in-out infinite"}}/>
      <div style={{position:"absolute",top:"20%",right:"8%",
        width:"30vw",height:"30vw",borderRadius:"50%",pointerEvents:"none",
        background:"radial-gradient(circle,rgba(200,148,58,.04) 0%,transparent 65%)",
        animation:"inkspot 12s 2s ease-in-out infinite"}}/>

      {/* Globe — perkament kleuren */}
      <div style={{position:"absolute",inset:0,zIndex:0}}>
        <ComposableMap projection="geoOrthographic"
          projectionConfig={{rotate,scale:600}} width={1200} height={900}
          style={{width:"100%",height:"100%"}}>
          <defs>
            <radialGradient id="aOc" cx="35%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#D4B870" stopOpacity=".90"/>
              <stop offset="55%"  stopColor="#C4A050" stopOpacity=".85"/>
              <stop offset="100%" stopColor="#B08830" stopOpacity=".80"/>
            </radialGradient>
            <radialGradient id="aShine" cx="28%" cy="24%" r="52%">
              <stop offset="0%"   stopColor="#E8CC70" stopOpacity=".30"/>
              <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="aRim" cx="50%" cy="50%" r="50%">
              <stop offset="78%"  stopColor="transparent"/>
              <stop offset="100%" stopColor="rgba(160,110,20,.35)" stopOpacity="1"/>
            </radialGradient>
            <filter id="aGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="9" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="antShad">
              <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#6B3A08" floodOpacity=".45"/>
            </filter>
          </defs>

          <circle cx={0} cy={0} r={600} fill="url(#aOc)"/>
          <circle cx={0} cy={0} r={600} fill="url(#aShine)"/>
          <circle cx={0} cy={0} r={600} fill="url(#aRim)"/>
          <circle cx={0} cy={0} r={599} fill="none" stroke="rgba(180,130,30,.22)" strokeWidth={3}/>

          <Geographies geography={geoUrl}>
            {({geographies}:{geographies:any[]})=>geographies.map((geo:any)=>{
              const isAnt=geo.id==="010"||geo.properties?.name==="Antarctica";
              return(
                <Geography key={geo.rsmKey} geography={geo}
                  filter={isAnt?"url(#antShad)":undefined}
                  fill={isAnt?"rgba(255,252,240,.98)":"rgba(55,35,10,.65)"}
                  stroke={isAnt?"rgba(180,130,40,.35)":"rgba(100,60,15,.14)"}
                  strokeWidth={isAnt?0.9:0.2}
                  style={{default:{outline:"none"},hover:{outline:"none"},pressed:{outline:"none"}}}/>
              );
            })}
          </Geographies>

          {/* Route glow */}
          {drawn.length>1&&(
            <Line coordinates={drawn} stroke="#C8A85A" strokeWidth={20}
              strokeLinecap="round" strokeLinejoin="round"
              style={{opacity:isFading?0:0.10,filter:"url(#aGlow)",
                transition:isFading?"opacity 1.6s ease":"none"}}/>
          )}
          {/* Route witte outline */}
          {drawn.length>1&&(
            <Line coordinates={drawn} stroke="rgba(255,248,225,.70)" strokeWidth={8}
              strokeLinecap="round" strokeLinejoin="round"
              style={{opacity:isFading?0:1,transition:isFading?"opacity 1.6s ease":"none"}}/>
          )}
          {/* Route kleurlijn */}
          {drawn.length>1&&(
            <Line coordinates={drawn} stroke="#C8A85A" strokeWidth={4}
              strokeLinecap="round" strokeLinejoin="round"
              style={{opacity:isFading?0:0.95,transition:isFading?"opacity 1.6s ease":"none"}}/>
          )}

          {/* Schip */}
          {progress>0.005&&progress<1&&!isFading&&(
            <Marker coordinates={shipPos}>
              <circle r={24} fill="#C8A85A" opacity={.12} className="ping"/>
              <circle r={13} fill="#C8A85A" opacity={.08} className="ping2"/>
              <circle r={5.5} fill="rgba(245,235,208,.95)" stroke="#C8A85A" strokeWidth={2.5}
                style={{filter:"drop-shadow(0 0 12px rgba(200,148,58,.85))"}}/>
              <text textAnchor="middle" y={-26} fontSize={18}
                style={{userSelect:"none",filter:"drop-shadow(0 2px 14px rgba(0,0,0,.90))"}}>🚢</text>
            </Marker>
          )}

          {/* Eindpunt */}
          {phase==="hold"&&(
            <Marker coordinates={ROUTE[ROUTE.length-1]}>
              <circle r={28} fill="#C8A85A" opacity={.12} className="ping"/>
              <circle r={8.5} fill="rgba(245,235,208,.95)" stroke="#C8A85A" strokeWidth={3}
                style={{filter:"drop-shadow(0 0 20px rgba(200,148,58,.90))"}}/>
            </Marker>
          )}
        </ComposableMap>
      </div>

      {/* Vignette — warm perkament */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:2,
        background:"radial-gradient(ellipse 72% 76% at 50% 50%,transparent 22%,rgba(180,120,20,.45) 100%)"}}/>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:2,
        background:"radial-gradient(ellipse 95% 95% at 50% 50%,transparent 50%,rgba(140,90,10,.65) 100%)"}}/>

      {/* Decoratieve gouden lijnen */}
      <div className="goldLine" style={{position:"absolute",top:0,left:0,right:0,height:2,zIndex:12,
        background:"linear-gradient(90deg,transparent 3%,rgba(139,74,16,.70) 50%,transparent 97%)"}}/>
      <div className="goldLine" style={{position:"absolute",bottom:0,left:0,right:0,height:2,zIndex:12,
        background:"linear-gradient(90deg,transparent 3%,rgba(139,74,16,.70) 50%,transparent 97%)",animationDelay:"2s"}}/>
      <div style={{position:"absolute",top:"6%",bottom:"6%",left:0,width:2,zIndex:12,
        background:"linear-gradient(180deg,transparent,rgba(139,74,16,.20),transparent)"}}/>
      <div style={{position:"absolute",top:"6%",bottom:"6%",right:0,width:2,zIndex:12,
        background:"linear-gradient(180deg,transparent,rgba(139,74,16,.20),transparent)"}}/>

      {/* Hoekdecoraties — goud */}
      {([[0,0],[0,1],[1,0],[1,1]] as [number,number][]).map(([b,r],i)=>(
        <div key={i} style={{position:"absolute",
          top:b===0?22:undefined,bottom:b===1?22:undefined,
          left:r===0?22:undefined,right:r===1?22:undefined,
          width:32,height:32,zIndex:13,pointerEvents:"none",
          borderTop:    b===0?"2px solid rgba(139,74,16,.45)":undefined,
          borderBottom: b===1?"2px solid rgba(139,74,16,.45)":undefined,
          borderLeft:   r===0?"2px solid rgba(139,74,16,.45)":undefined,
          borderRight:  r===1?"2px solid rgba(139,74,16,.45)":undefined,
        }}/>
      ))}

      {/* Hoofd content */}
      <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        <div style={{padding:"0 60px",display:"flex",flexDirection:"column",
          alignItems:"center",maxWidth:880,width:"100%"}}>

          {/* Label + Belgische vlag */}
          <div className="f1" style={{display:"flex",alignItems:"center",gap:18,marginBottom:38}}>
            <div style={{width:48,height:1.5,
              background:"linear-gradient(90deg,transparent,rgba(139,74,16,.50))"}}/>
            <div style={{display:"flex",gap:3,marginRight:6}}>
              {["#1A1A1A","#FDDA25","#EF3340"].map((c,i)=>(
                <div key={i} style={{width:5,height:18,borderRadius:2,background:c,opacity:.75}}/>
              ))}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,
              color:"rgba(100,55,12,.60)",letterSpacing:".38em",textTransform:"uppercase"}}>
              {t.label}
            </div>
            <div style={{width:48,height:1.5,
              background:"linear-gradient(90deg,rgba(139,74,16,.50),transparent)"}}/>
          </div>

          {/* Hoofdtitel — donker sepia */}
          <div className="f2" style={{
            fontFamily:"'Playfair Display',serif",fontSize:108,fontWeight:900,
            color:"rgba(60,28,6,.80)",lineHeight:.84,
            letterSpacing:"-.032em",textAlign:"center",marginBottom:6,
            textShadow:"0 4px 40px rgba(139,74,16,.15)"}}>
            {t.titel1}
          </div>
          {/* Italic titel — goud shimmer */}
          <div className="f2 shimmer" style={{
            fontFamily:"'Playfair Display',serif",fontSize:108,fontWeight:400,
            fontStyle:"italic",lineHeight:.88,
            letterSpacing:"-.018em",textAlign:"center",marginBottom:50}}>
            {t.titel2}
          </div>

          {/* Gouden scheidingslijn */}
          <div className="f3" style={{width:130,height:2,marginBottom:28,
            background:"linear-gradient(90deg,transparent,rgba(139,74,16,.75),transparent)"}}/>

          {/* Citaat */}
          <div className="f3" style={{
            fontFamily:"'Playfair Display',serif",fontStyle:"italic",
            fontSize:21,fontWeight:300,
            color:"rgba(100,55,12,.58)",
            letterSpacing:".03em",textAlign:"center",
            marginBottom:10,lineHeight:1.65,maxWidth:620}}>
            "{t.quote}"
          </div>
          <div className="f3" style={{
            fontFamily:"'JetBrains Mono',monospace",fontSize:12,
            color:"rgba(139,74,16,.55)",letterSpacing:".16em",
            textAlign:"center",marginBottom:62}}>
            {t.quoteBy}
          </div>

          {/* Touch indicator — warm goud */}
          <div className="f4 float" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
            <div style={{position:"relative",width:96,height:96,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              {[96,68,42].map((sz,i)=>(
                <div key={i} style={{position:"absolute",
                  width:sz,height:sz,borderRadius:"50%",
                  border:`${i===0?"1.5px":"1px"} solid rgba(139,74,16,${pulse?(0.45-i*0.10).toFixed(2):(0.18-i*0.04).toFixed(2)})`,
                  transform:pulse?`scale(${1+i*0.06})`:"scale(1)",
                  transition:"all 1.8s ease"}}/>
              ))}
              {/* Centrum */}
              <div style={{
                width:18,height:18,borderRadius:"50%",
                background:pulse?"rgba(139,74,16,.90)":"rgba(139,74,16,.28)",
                boxShadow:pulse?"0 0 30px rgba(200,148,58,.60),0 0 60px rgba(200,148,58,.25)":"none",
                transition:"all 1.8s ease"}}/>
            </div>
            <div style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:12,
              letterSpacing:".28em",textTransform:"uppercase",textAlign:"center",
              color:pulse?"rgba(100,55,12,.75)":"rgba(100,55,12,.30)",
              transition:"color 1.8s ease"}}>
              {t.touch}
            </div>
          </div>
        </div>
      </div>

      {/* Expeditie chips — onderaan, perkament stijl */}
      <div className="f5" style={{position:"absolute",bottom:48,left:0,right:0,
        display:"flex",justifyContent:"center",gap:32,pointerEvents:"none",zIndex:11}}>
        {EXPS.map((e,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,
            padding:"12px 22px",borderRadius:14,
            background:"rgba(235,218,178,.80)",
            border:`1px solid ${e.k}55`,
            backdropFilter:"blur(12px)",
            boxShadow:"0 4px 16px rgba(80,40,8,.12)"}}>
            <div style={{display:"flex",flexDirection:"column",gap:3,flexShrink:0}}>
              <div style={{width:26,height:2.5,borderRadius:2,background:e.k,
                boxShadow:`0 0 8px ${e.k}80`}}/>
              <div style={{width:16,height:1.5,borderRadius:1,background:e.k,opacity:.45}}/>
            </div>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                color:"rgba(80,45,10,.80)",letterSpacing:".10em",textTransform:"uppercase",fontWeight:600}}>
                {e.naam}
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,
                color:"rgba(100,60,15,.50)",letterSpacing:".08em",marginTop:3}}>
                {e.jaar}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="f6" style={{position:"absolute",top:30,right:52,
        fontFamily:"'JetBrains Mono',monospace",fontSize:10,
        color:"rgba(100,55,12,.45)",letterSpacing:".22em",textTransform:"uppercase",
        zIndex:12,pointerEvents:"none",display:"flex",alignItems:"center",gap:10}}>
        <div className="breathe" style={{width:8,height:8,borderRadius:"50%",
          background:"rgba(139,74,16,.60)",
          boxShadow:"0 0 10px rgba(200,148,58,.60)"}}/>
        Live · Utsteinen
      </div>

      {/* Copyright */}
      <div className="f6" style={{position:"absolute",bottom:20,left:52,
        fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:14,
        color:"rgba(100,55,12,.28)",letterSpacing:".05em",zIndex:12,pointerEvents:"none"}}>
        © België 2025
      </div>
    </div>
  );
}