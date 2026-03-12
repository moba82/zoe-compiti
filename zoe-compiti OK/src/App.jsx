import { useState, useEffect, useRef, useCallback } from "react";

const M = { 50:"#F0FBF5",100:"#D6F5E6",200:"#A8E6CF",300:"#6DCBA8",400:"#4CAF8A",500:"#2D7A5A",600:"#1E5C43" };
const BROWN = { light:"#D4A574", mid:"#B08050" };
const CREAM = "#FAFFF8";

const DAYS      = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
const FULL_DAYS = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];

const SUBJECTS = [
  { id:"mat",  label:"Matematica",  emoji:"📐" },
  { id:"geo",  label:"Geometria",   emoji:"📏" },
  { id:"ari",  label:"Aritmetica",  emoji:"🔢" },
  { id:"gram", label:"Grammatica",  emoji:"✏️"  },
  { id:"lett", label:"Letteratura", emoji:"📚" },
  { id:"sci",  label:"Scienze",     emoji:"🔬" },
  { id:"sto",  label:"Storia",      emoji:"📜" },
  { id:"geo2", label:"Geografia",   emoji:"🌍" },
  { id:"eng",  label:"Inglese",     emoji:"🇬🇧" },
  { id:"esp",  label:"Spagnolo",    emoji:"🇪🇸" },
  { id:"tec",  label:"Tecnologia",  emoji:"⚙️"  },
  { id:"art",  label:"Arte",        emoji:"🎨" },
  { id:"mus",  label:"Musica",      emoji:"🎵" },
  { id:"cla",  label:"Clarinetto",  emoji:"🎶" },
  { id:"mot",  label:"Motoria",     emoji:"🏃" },
];

const HUES = ["#4CAF8A","#60BA96","#74C4A2","#52A882","#3D9970","#6DCBA8","#48B890","#7ABFA5","#5BA882","#85CEB0","#4CAF8A","#60BA96","#74C4A2","#52A882","#3D9970"];
function subColor(idx){ return { bg:HUES[idx%HUES.length], light:HUES[idx%HUES.length]+"28" }; }
const CHEERS = ["🐴","🏇","🌿","🍀","✨","💚","🌱","🎶","🐎","🌾"];

// ── Horse emoji instead of broken SVG ──
function HorseIcon({ size=48, style={} }){
  return <div style={{ fontSize:size*0.7, lineHeight:1, display:"inline-block", ...style }}>🐴</div>;
}

function Horseshoe({ size=28, color=M[300], style={} }){
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
      <path d="M8 30 Q6 18 10 10 Q14 4 20 4 Q26 4 30 10 Q34 18 32 30" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
      <rect x="5" y="28" width="8" height="5" rx="2" fill={color}/>
      <rect x="27" y="28" width="8" height="5" rx="2" fill={color}/>
    </svg>
  );
}

// ── Timer Modal ──
function TimerModal({ task, onClose }){
  const [secs, setSecs]       = useState(task.duration*60);
  const [running, setRunning] = useState(false);
  const [done, setDone]       = useState(false);
  const ref = useRef(null);
  useEffect(()=>{
    if(running && secs>0){ ref.current=setInterval(()=>setSecs(s=>s-1),1000); }
    else if(secs===0&&running){ setRunning(false); setDone(true); }
    return ()=>clearInterval(ref.current);
  },[running,secs]);
  const pct=((task.duration*60-secs)/(task.duration*60))*100;
  const mm=String(Math.floor(secs/60)).padStart(2,"0");
  const ss=String(secs%60).padStart(2,"0");
  const R=70; const circ=2*Math.PI*R;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,92,67,.5)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,fontFamily:"'Quicksand',sans-serif"}}>
      <div style={{background:CREAM,borderRadius:36,padding:"44px 48px",maxWidth:380,width:"92%",textAlign:"center",border:`4px solid ${M[200]}`,boxShadow:"0 36px 80px rgba(30,92,67,.28)",position:"relative",overflow:"hidden"}}>
        <div style={{fontSize:44,marginBottom:6}}>{task.emoji}</div>
        <div style={{fontSize:20,fontWeight:800,color:M[500],marginBottom:4}}>{task.label}</div>
        <div style={{fontSize:13,color:BROWN.mid,fontWeight:700,marginBottom:30}}>{task.text}</div>
        <div style={{position:"relative",width:160,height:160,margin:"0 auto 28px"}}>
          <svg width="160" height="160" style={{transform:"rotate(-90deg)"}}>
            <circle cx="80" cy="80" r={R} fill="none" stroke={M[100]} strokeWidth="12"/>
            <circle cx="80" cy="80" r={R} fill="none" stroke={M[400]} strokeWidth="12" strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            {done?<div style={{fontSize:56}}>🐴</div>:<>
              <div style={{fontSize:36,fontWeight:900,color:M[500],lineHeight:1}}>{mm}:{ss}</div>
              <div style={{fontSize:11,color:M[300],fontWeight:700,letterSpacing:1}}>MIN</div>
            </>}
          </div>
        </div>
        {done&&<div style={{marginBottom:22}}><div style={{fontSize:21,fontWeight:900,color:M[400]}}>Bravissima Zoe! 🐴✨</div></div>}
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          {!done&&<button onClick={()=>setRunning(r=>!r)} style={{background:running?"#E8A87C":`linear-gradient(135deg,${M[400]},${M[300]})`,color:"white",border:"none",borderRadius:18,padding:"13px 28px",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif"}}>{running?"⏸ Pausa":"▶ Avvia"}</button>}
          <button onClick={onClose} style={{background:M[50],color:M[500],border:`2px solid ${M[200]}`,borderRadius:18,padding:"13px 20px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Quicksand',sans-serif"}}>✕ Chiudi</button>
        </div>
      </div>
    </div>
  );
}

// ── Add Task Modal ──
function AddTaskModal({ day, onAdd, onClose }){
  const [subject, setSubject]       = useState(SUBJECTS[0]);
  const [text, setText]             = useState("");
  const [duration, setDuration]     = useState(20);
  const [isRevision, setIsRevision] = useState(false);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,92,67,.42)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,fontFamily:"'Quicksand',sans-serif"}}>
      <div style={{background:CREAM,borderRadius:32,padding:"36px 40px",maxWidth:460,width:"94%",boxShadow:"0 28px 64px rgba(30,92,67,.22)",border:`3px solid ${M[200]}`,position:"relative",overflow:"hidden",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{fontSize:25,fontWeight:900,color:M[500],marginBottom:2}}>🌿 Nuovo compito</div>
        <div style={{fontSize:13,color:BROWN.light,fontWeight:700,marginBottom:26}}>{FULL_DAYS[day]}</div>
        <div style={{fontSize:11,fontWeight:800,color:M[300],marginBottom:10,letterSpacing:1.2,textTransform:"uppercase"}}>Materia</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
          {SUBJECTS.map((s,i)=>{
            const sel=subject.id===s.id; const c=subColor(i);
            return <button key={s.id} onClick={()=>setSubject(s)} style={{padding:"8px 14px",borderRadius:24,border:`2px solid ${sel?M[400]:M[100]}`,background:sel?c.light:"white",fontSize:13,fontWeight:800,cursor:"pointer",color:sel?M[500]:BROWN.mid,fontFamily:"'Quicksand',sans-serif",transition:"all .15s"}}>{s.emoji} {s.label}</button>;
          })}
        </div>
        <div style={{fontSize:11,fontWeight:800,color:M[300],marginBottom:8,letterSpacing:1.2,textTransform:"uppercase"}}>Descrizione</div>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Es: Esercizi pag. 42-43…" style={{width:"100%",padding:"12px 16px",borderRadius:16,border:`2px solid ${M[200]}`,fontSize:14,fontFamily:"'Quicksand',sans-serif",fontWeight:700,boxSizing:"border-box",outline:"none",marginBottom:22,color:M[500],background:M[50]}}/>
        <div style={{fontSize:11,fontWeight:800,color:M[300],marginBottom:8,letterSpacing:1.2,textTransform:"uppercase"}}>Tempo stimato: <span style={{color:M[400],fontSize:13}}>{duration} min</span></div>
        <input type="range" min={5} max={120} step={5} value={duration} onChange={e=>setDuration(Number(e.target.value))} style={{width:"100%",marginBottom:22,accentColor:M[400]}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <div onClick={()=>setIsRevision(r=>!r)} style={{width:48,height:26,borderRadius:13,background:isRevision?M[400]:"#dfe6e9",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:isRevision?25:3,width:20,height:20,borderRadius:"50%",background:"white",boxShadow:"0 2px 6px rgba(0,0,0,.15)",transition:"left .2s"}}/>
          </div>
          <span style={{fontSize:14,fontWeight:800,color:M[500]}}>🎶 Da ripassare</span>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{ if(text.trim()) onAdd({...subject,text,duration,isRevision,done:false,id:Date.now()}); }} style={{flex:1,background:`linear-gradient(135deg,${M[400]},${M[300]})`,color:"white",border:"none",borderRadius:18,padding:"14px",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif"}}>Aggiungi 🌿</button>
          <button onClick={onClose} style={{background:M[50],color:M[500],border:`2px solid ${M[200]}`,borderRadius:18,padding:"14px 18px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Quicksand',sans-serif"}}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──
export default function App(){
  const [tasks, setTasks] = useState(()=>{
    try{ const s=localStorage.getItem("zoe_tasks_v3"); return s?JSON.parse(s):Array(7).fill(null).map(()=>[]); }
    catch{ return Array(7).fill(null).map(()=>[]); }
  });
  const [activeDay, setActiveDay] = useState(()=>{ const d=new Date().getDay(); return d===0?6:d-1; });
  const [showAdd, setShowAdd]     = useState(false);
  const [timerTask, setTimerTask] = useState(null);
  const [cheer, setCheer]         = useState(null);
  const [view, setView]           = useState("day");
  const [showSync, setShowSync]   = useState(false);
  const [syncCode, setSyncCode]   = useState("");
  const [syncMsg, setSyncMsg]     = useState("");

  // Save to localStorage on every change
  useEffect(()=>{
    try{ localStorage.setItem("zoe_tasks_v3",JSON.stringify(tasks)); }catch{}
  },[tasks]);

  const addTask = (task)=>{
    setTasks(p=>p.map((d,i)=>i===activeDay?[...d,task]:d));
    setShowAdd(false);
  };

  const toggleDone = (di,id)=>{
    const t=(tasks[di]||[]).find(x=>x.id===id);
    setTasks(p=>p.map((d,i)=>i===di?d.map(x=>x.id===id?{...x,done:!x.done}:x):d));
    if(t&&!t.done){ setCheer(CHEERS[Math.floor(Math.random()*CHEERS.length)]); setTimeout(()=>setCheer(null),2100); }
  };

  const delTask = (di,id)=>setTasks(p=>p.map((d,i)=>i===di?d.filter(x=>x.id!==id):d));

  // Export code to share tasks
  const exportCode = ()=>{
    try{
      const json = JSON.stringify(tasks);
      const code = btoa(encodeURIComponent(json));
      return code;
    }catch{ return ""; }
  };

  // Import from code
  const importCode = (code)=>{
    try{
      const json = decodeURIComponent(atob(code.trim()));
      const data = JSON.parse(json);
      if(Array.isArray(data) && data.length===7){
        setTasks(data);
        setSyncMsg("✅ Compiti aggiornati!");
        setTimeout(()=>setSyncMsg(""),3000);
      } else { setSyncMsg("❌ Codice non valido"); }
    }catch{ setSyncMsg("❌ Codice non valido"); }
  };

  const dayTasks  = tasks[activeDay]||[];
  const pending   = dayTasks.filter(t=>!t.done);
  const completed = dayTasks.filter(t=>t.done);
  const progress  = dayTasks.length?(completed.length/dayTasks.length)*100:0;
  const revisions = tasks.flatMap((d,i)=>(d||[]).filter(t=>t.isRevision&&!t.done).map(t=>({...t,dayIdx:i})));
  const wTotal    = tasks.flat().length;
  const wDone     = tasks.flat().filter(t=>t.done).length;

  const TaskCard = ({task,dayIdx,showTimer=true})=>{
    const isDone=task.done;
    const si=SUBJECTS.findIndex(s=>s.id===task.id);
    return(
      <div style={{display:"flex",alignItems:"center",gap:12,background:isDone?"rgba(168,230,207,.22)":"rgba(255,255,255,.92)",backdropFilter:"blur(16px)",borderRadius:22,padding:"14px 16px",border:`2.5px solid ${isDone?M[200]+"88":M[200]}`,opacity:isDone?.78:1,boxShadow:isDone?"none":`0 4px 16px ${M[400]}18`,transition:"all .25s"}}>
        <div onClick={()=>toggleDone(dayIdx,task.id)} style={{width:38,height:38,borderRadius:12,cursor:"pointer",flexShrink:0,border:`2.5px solid ${M[400]}`,background:isDone?`linear-gradient(135deg,${M[400]},${M[300]})`:"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
          {isDone&&<span style={{color:"white",fontSize:18,fontWeight:900,lineHeight:1}}>✓</span>}
        </div>
        <div style={{width:36,height:36,borderRadius:10,background:isDone?M[100]:subColor(si>=0?si:0).light,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{task.emoji}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:800,color:M[300],marginBottom:1}}>
            {task.label}
            {task.isRevision&&<span style={{marginLeft:6,fontSize:10,background:M[50],color:M[400],borderRadius:8,padding:"1px 7px",border:`1px solid ${M[200]}`}}>🎶 ripasso</span>}
          </div>
          <div style={{fontSize:15,fontWeight:800,color:isDone?M[300]:M[500],textDecoration:isDone?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.text}</div>
          <div style={{fontSize:11,color:BROWN.light,fontWeight:700,marginTop:2}}>⏱ {task.duration} min</div>
        </div>
        {showTimer&&!isDone&&<button onClick={()=>setTimerTask(task)} style={{background:`linear-gradient(135deg,${M[400]},${M[300]})`,color:"white",border:"none",borderRadius:14,padding:"9px 14px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif",flexShrink:0}}>▶</button>}
        <button onClick={()=>delTask(dayIdx,task.id)} style={{background:"transparent",color:"#C8D6D0",border:"none",fontSize:22,cursor:"pointer",padding:"2px 4px",flexShrink:0,lineHeight:1}}>×</button>
      </div>
    );
  };

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${M[50]} 0%,#C8EDD8 40%,#B8E8CC 70%,${M[200]} 100%)`,fontFamily:"'Quicksand',sans-serif",paddingBottom:80}}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes popIn{0%{transform:scale(0) rotate(-15deg);opacity:0}25%{transform:scale(1.4) rotate(5deg);opacity:1}70%{transform:scale(1.1);opacity:1}100%{transform:scale(.6) translateY(-60px);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gallop{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .card:hover{transform:translateX(4px)!important}
        .daybtn:hover{transform:translateY(-3px)!important}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${M[200]};border-radius:3px}
      `}</style>

      {/* HEADER */}
      <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(24px)",borderBottom:`3px solid ${M[200]}`,boxShadow:`0 4px 24px ${M[400]}22`}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"18px 20px 14px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{animation:"gallop 2.5s ease-in-out infinite",fontSize:44}}>🐴</div>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:M[500],lineHeight:1.1}}>Ciao Zoe! 🌿</div>
                <div style={{fontSize:12,color:M[300],fontWeight:700}}>Il tuo planner dei compiti 🐴</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {wTotal>0&&<div style={{background:`linear-gradient(135deg,${M[400]},${M[300]})`,borderRadius:18,padding:"10px 18px",textAlign:"center",boxShadow:`0 4px 16px ${M[400]}44`}}>
                <div style={{fontSize:20,fontWeight:900,color:"white",lineHeight:1}}>{wDone}/{wTotal}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.8)",fontWeight:700,letterSpacing:1}}>SETT.</div>
              </div>}
              <button onClick={()=>setShowSync(s=>!s)} style={{background:M[50],border:`2px solid ${M[200]}`,borderRadius:16,padding:"8px 12px",fontSize:13,fontWeight:800,cursor:"pointer",color:M[500],fontFamily:"'Quicksand',sans-serif"}} title="Sincronizza">🔄</button>
            </div>
          </div>

          {/* Sync panel */}
          {showSync&&(
            <div style={{background:M[50],border:`2px solid ${M[200]}`,borderRadius:20,padding:"16px",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:800,color:M[500],marginBottom:10}}>🔄 Condividi i compiti</div>
              <div style={{fontSize:12,color:M[300],marginBottom:8,fontWeight:700}}>1. Copia questo codice e mandalo all'altro telefono:</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <input readOnly value={exportCode()} style={{flex:1,padding:"8px 12px",borderRadius:12,border:`2px solid ${M[200]}`,fontSize:11,fontFamily:"monospace",background:"white",color:M[500]}}/>
                <button onClick={()=>{navigator.clipboard.writeText(exportCode()); setSyncMsg("✅ Copiato!");setTimeout(()=>setSyncMsg(""),2000);}} style={{background:`linear-gradient(135deg,${M[400]},${M[300]})`,color:"white",border:"none",borderRadius:12,padding:"8px 14px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif"}}>Copia</button>
              </div>
              <div style={{fontSize:12,color:M[300],marginBottom:8,fontWeight:700}}>2. Oppure incolla il codice ricevuto qui:</div>
              <div style={{display:"flex",gap:8}}>
                <input value={syncCode} onChange={e=>setSyncCode(e.target.value)} placeholder="Incolla codice..." style={{flex:1,padding:"8px 12px",borderRadius:12,border:`2px solid ${M[200]}`,fontSize:11,fontFamily:"monospace",background:"white",color:M[500]}}/>
                <button onClick={()=>importCode(syncCode)} style={{background:`linear-gradient(135deg,${M[400]},${M[300]})`,color:"white",border:"none",borderRadius:12,padding:"8px 14px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif"}}>Carica</button>
              </div>
              {syncMsg&&<div style={{marginTop:8,fontSize:13,fontWeight:800,color:syncMsg.includes("✅")?M[400]:"#e74c3c"}}>{syncMsg}</div>}
            </div>
          )}

          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["day","🐴 Oggi"],["week","🗓 Settimana"],["revision",`🎶 Ripasso${revisions.length>0?` (${revisions.length})`:""}`]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"8px 16px",borderRadius:20,border:"none",background:view===v?`linear-gradient(135deg,${M[400]},${M[300]})`:`rgba(168,230,207,.4)`,color:view===v?"white":M[500],fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif",boxShadow:view===v?`0 4px 14px ${M[400]}44`:"none",transition:"all .2s"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"0 16px"}}>

        {/* DAY VIEW */}
        {view==="day"&&<>
          <div style={{display:"flex",gap:8,padding:"20px 0 4px",overflowX:"auto"}}>
            {DAYS.map((d,i)=>{
              const dt=tasks[i]||[]; const dc=dt.filter(t=>t.done).length;
              const ok=dt.length>0&&dc===dt.length; const on=activeDay===i;
              return(
                <button key={i} className="daybtn" onClick={()=>setActiveDay(i)} style={{minWidth:62,padding:"10px 8px",borderRadius:18,border:`3px solid ${on?M[400]:"transparent"}`,background:on?`linear-gradient(145deg,${M[400]},${M[300]})`:"rgba(255,255,255,.68)",color:on?"white":M[500],fontSize:13,fontWeight:900,cursor:"pointer",fontFamily:"'Quicksand',sans-serif",textAlign:"center",backdropFilter:"blur(10px)",flexShrink:0,boxShadow:on?`0 6px 18px ${M[400]}44`:"none",transition:"all .2s"}}>
                  {d}
                  {dt.length>0&&<div style={{marginTop:4,fontSize:10,fontWeight:800,color:on?"rgba(255,255,255,.85)":ok?M[400]:BROWN.mid}}>{ok?"✓ ok!":` ${dc}/${dt.length}`}</div>}
                </button>
              );
            })}
          </div>

          {dayTasks.length>0&&(
            <div style={{margin:"14px 0 6px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,fontWeight:800,color:M[500]}}>Progresso di oggi</span>
                <span style={{fontSize:12,fontWeight:800,color:M[400]}}>{Math.round(progress)}%</span>
              </div>
              <div style={{height:12,background:"rgba(255,255,255,.55)",borderRadius:6,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,borderRadius:6,transition:"width .6s ease",background:`linear-gradient(90deg,${M[400]},${M[300]},${M[200]})`,boxShadow:`0 2px 8px ${M[400]}44`}}/>
              </div>
              {progress===100&&<div style={{textAlign:"center",marginTop:10,fontSize:15,fontWeight:800,color:M[500],animation:"fadeUp .4s ease"}}>🐴 Bravissima Zoe! Tutti completati! ✨</div>}
            </div>
          )}

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"20px 0 14px"}}>
            <div>
              <div style={{fontSize:22,fontWeight:900,color:M[500]}}>{FULL_DAYS[activeDay]}</div>
              <div style={{fontSize:12,color:M[300],fontWeight:700}}>{dayTasks.length===0?"Nessun compito":`${completed.length} di ${dayTasks.length} completati`}</div>
            </div>
            <button onClick={()=>setShowAdd(true)} style={{background:`linear-gradient(135deg,${M[400]},${M[300]})`,color:"white",border:"none",borderRadius:20,padding:"11px 20px",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif",boxShadow:`0 5px 16px ${M[400]}44`}}>+ Aggiungi</button>
          </div>

          {dayTasks.length===0?(
            <div style={{background:"rgba(255,255,255,.62)",backdropFilter:"blur(16px)",borderRadius:28,padding:"52px 24px",textAlign:"center",border:`3px dashed ${M[200]}`}}>
              <div style={{fontSize:72,marginBottom:16}}>🐴</div>
              <div style={{fontSize:18,fontWeight:800,color:M[300]}}>Nessun compito oggi!</div>
              <div style={{fontSize:13,color:BROWN.light,fontWeight:600,marginTop:4}}>Premi + Aggiungi per iniziare 🌿</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {pending.length>0&&<>
                <div style={{fontSize:11,fontWeight:800,color:M[300],letterSpacing:1.2,textTransform:"uppercase",marginBottom:2,marginTop:4}}>📋 Da fare ({pending.length})</div>
                {pending.map(t=><div key={t.id} className="card"><TaskCard task={t} dayIdx={activeDay} showTimer/></div>)}
              </>}
              {completed.length>0&&<>
                <div style={{fontSize:11,fontWeight:800,color:M[400],letterSpacing:1.2,textTransform:"uppercase",marginTop:10,marginBottom:2}}>✓ Completati ({completed.length})</div>
                {completed.map(t=><div key={t.id} className="card"><TaskCard task={t} dayIdx={activeDay} showTimer={false}/></div>)}
              </>}
            </div>
          )}
        </>}

        {/* WEEK VIEW */}
        {view==="week"&&(
          <div style={{marginTop:20}}>
            <div style={{fontSize:22,fontWeight:900,color:M[500],marginBottom:16}}>Vista settimana 🗓</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {DAYS.map((d,i)=>{
                const dt=tasks[i]||[]; const dc=dt.filter(t=>t.done).length; const ok=dt.length>0&&dc===dt.length;
                return(
                  <div key={i} onClick={()=>{setActiveDay(i);setView("day");}} style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(16px)",borderRadius:22,padding:"16px 20px",cursor:"pointer",transition:"all .2s",border:`2.5px solid ${i===activeDay?M[400]:M[200]}`,boxShadow:i===activeDay?`0 6px 20px ${M[400]}28`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:dt.length?10:0}}>
                      <div style={{fontWeight:900,fontSize:16,color:M[500]}}>{FULL_DAYS[i]}</div>
                      <div style={{fontSize:12,fontWeight:800,padding:"3px 10px",borderRadius:10,color:dt.length===0?"#C8D6D0":ok?M[400]:BROWN.mid,background:dt.length===0?"transparent":ok?M[50]:"#FFF5EB"}}>
                        {dt.length===0?"libero 🌿":ok?"✓ tutto fatto!":` ${dc}/${dt.length} fatti`}
                      </div>
                    </div>
                    {dt.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {dt.map(t=><div key={t.id} style={{background:t.done?M[100]:subColor(SUBJECTS.findIndex(s=>s.id===t.id)).light,color:t.done?M[300]:M[500],borderRadius:10,padding:"3px 10px",fontSize:11,fontWeight:800,textDecoration:t.done?"line-through":"none",border:`1.5px solid ${t.done?M[200]:M[300]}`}}>{t.emoji} {t.label}</div>)}
                    </div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REVISION VIEW */}
        {view==="revision"&&(
          <div style={{marginTop:20}}>
            <div style={{fontSize:22,fontWeight:900,color:M[500],marginBottom:4}}>Da ripassare 🎶</div>
            <div style={{fontSize:13,color:M[300],fontWeight:700,marginBottom:16}}>Tutti i ripasso in un posto!</div>
            {revisions.length===0?(
              <div style={{background:"rgba(255,255,255,.65)",backdropFilter:"blur(16px)",borderRadius:28,padding:"52px 24px",textAlign:"center",border:`3px dashed ${M[200]}`}}>
                <Horseshoe size={52} color={M[300]} style={{margin:"0 auto 16px",display:"block"}}/>
                <div style={{fontSize:18,fontWeight:800,color:M[300]}}>Nessun ripasso pendente!</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {revisions.map(task=>(
                  <div key={task.id} className="card">
                    <div style={{display:"flex",alignItems:"center",gap:12,background:"rgba(255,255,255,.9)",backdropFilter:"blur(16px)",borderRadius:22,padding:"16px 18px",border:`2.5px solid ${M[400]}`,boxShadow:`0 5px 18px ${M[400]}22`}}>
                      <div style={{fontSize:30}}>{task.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:800,color:M[300]}}>{FULL_DAYS[task.dayIdx]} · {task.label}</div>
                        <div style={{fontSize:15,fontWeight:800,color:M[500]}}>{task.text}</div>
                        <div style={{fontSize:11,color:BROWN.light,fontWeight:700}}>⏱ {task.duration} min</div>
                      </div>
                      <button onClick={()=>setTimerTask(task)} style={{background:`linear-gradient(135deg,${M[400]},${M[300]})`,color:"white",border:"none",borderRadius:16,padding:"10px 16px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Quicksand',sans-serif"}}>▶ Ripassa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {cheer&&<div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:2000}}><div style={{fontSize:110,animation:"popIn 2.1s ease-out forwards"}}>{cheer}</div></div>}
      {showAdd&&<AddTaskModal day={activeDay} onAdd={addTask} onClose={()=>setShowAdd(false)}/>}
      {timerTask&&<TimerModal task={timerTask} onClose={()=>setTimerTask(null)}/>}
    </div>
  );
}
