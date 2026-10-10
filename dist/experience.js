'use strict';
// Conceptual architectures grounded in the technologies listed in the CV.
const architectures = {
  web: {title:'Una plataforma web, de punta a punta.',layers:[
    ['Interfaz','La parte que las personas usan.','HTML5, CSS3 y JavaScript para una experiencia responsiva, clara y conectada a la API.'],
    ['API REST','Donde las acciones se convierten en lógica.','ASP.NET Core y C# para estructurar servicios y conectar la interfaz con la información.'],
    ['Datos','Información organizada para ser útil.','SQL Server con Dapper o Entity Framework Core: modelado de datos y acceso desde la aplicación.'],
    ['Integraciones','Una aplicación que conversa con otras.','APIs de terceros y servicios de correo para conectar capacidades externas a la experiencia web.']
  ]},
  mobile: {title:'Una experiencia móvil conectada.',layers:[
    ['App móvil','La experiencia, en la palma de la mano.','FlutterFlow y diseño de interfaces para estructurar la navegación y las pantallas de una aplicación móvil.'],
    ['Servicios','Conectar la app con lo que necesita.','Firebase y APIs RESTful para integrar servicios y comunicar las aplicaciones web y móviles.'],
    ['Persistencia','Datos que acompañan a la experiencia.','SQLite y bases de datos relacionales o NoSQL, seleccionadas según las necesidades de la solución.'],
    ['Arquitectura','Pensar más allá de una sola pantalla.','Estructuración de aplicaciones, modelado de soluciones y buenas prácticas de desarrollo multiplataforma.']
  ]},
  automation: {title:'De una tarea repetitiva a un proceso claro.',layers:[
    ['Diagnóstico','Entender antes de automatizar.','Identificar la tarea, revisar su contexto y definir qué necesita el proceso para resolver el problema.'],
    ['Scripts','Convertir repetición en instrucciones.','Python y Bash para automatizar tareas de mantenimiento y seguridad en entornos Linux.'],
    ['Verificación','Comprobar qué ocurrió.','Revisión de resultados, diagnóstico de incidencias y documentación de los pasos de resolución.'],
    ['Operación','Dejar un proceso que se pueda entender.','Control de versiones con Git, documentación y colaboración para mantener y mejorar la solución.']
  ]}
};
const buildCards = [...document.querySelectorAll('[data-project]')];
const blueprint = document.querySelector('.blueprint');
let selectedProject = 'web';
function showLayer(index) {
  const layer = architectures[selectedProject].layers[index];
  document.querySelector('#blueprint-index').textContent = `0${index + 1} / ${layer[0].toUpperCase()}`;
  document.querySelector('#blueprint-detail-title').textContent = layer[1];
  document.querySelector('#blueprint-detail-text').textContent = layer[2];
  document.querySelectorAll('#blueprint-nodes button').forEach((b,i) => b.setAttribute('aria-pressed',String(i===index)));
}
function showArchitecture(key) {
  selectedProject = key;
  buildCards.forEach(b => {const selected=b.dataset.project===key;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
  const architecture = architectures[key];
  document.querySelector('#blueprint-title').textContent = architecture.title;
  document.querySelector('#blueprint-nodes').replaceChildren(...architecture.layers.map((layer,i) => {
    const button = document.createElement('button');
    const index = document.createElement('span'); index.textContent=`0${i+1}`;
    button.append(index,document.createTextNode(layer[0]));
    button.addEventListener('click',()=>showLayer(i)); return button;
  }));
  showLayer(0);
  blueprint.classList.remove('signal');
  requestAnimationFrame(()=>requestAnimationFrame(()=>blueprint.classList.add('signal')));
}
buildCards.forEach(b=>b.addEventListener('click',()=>{
  showArchitecture(b.dataset.project);
  blueprint.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
}));
showArchitecture('web');

// Particle topology transitions from a sphere into a torus with the scroll.
// Movement is driven by input; the initial entrance settles within four seconds.
const canvas = document.querySelector('#system');
const ctx = canvas.getContext('2d');
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,frame=0,pointer={x:0,y:0},current={x:0,y:0},scrollMix=0,rotation=.4;
let introductionStart=performance.now();
const count=420;
const points=Array.from({length:count},(_,i)=>{
  const y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y),phi=i*Math.PI*(3-Math.sqrt(5));
  const u=(i%42)/42*Math.PI*2,v=Math.floor(i/42)/10*Math.PI*2;
  return {sphere:[Math.cos(phi)*r,y,Math.sin(phi)*r],torus:[(.73+.28*Math.cos(v))*Math.cos(u),(.73+.28*Math.cos(v))*Math.sin(u),.28*Math.sin(v)]};
});
// Neighbour connections are computed once, rather than at every frame.
const connections=[];
for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){
  if(Math.hypot(...points[i].sphere.map((v,k)=>v-points[j].sphere[k]))<.205)connections.push([i,j]);
}
function drawTopology(time) {
  frame=0;
  if(!ctx||document.hidden||!width||!height)return;
  const reduced=motionQuery.matches;
  const entering=!reduced&&time-introductionStart<3800;
  current.x+=(pointer.x-current.x)*.09; current.y+=(pointer.y-current.y)*.09;
  if(entering)rotation+=.003;
  ctx.clearRect(0,0,width,height);
  const radius=Math.min(width,height)*.34,cx=width*.52,cy=height*.49;
  const mix=reduced?0:scrollMix,rot=rotation+current.x*.5+mix*.8,tilt=.28+current.y*.4;
  const projected=points.map(p=>{
    const [xx,yy,zz]=p.sphere.map((v,k)=>v*(1-mix)+p.torus[k]*mix);
    const x=xx*Math.cos(rot)+zz*Math.sin(rot),z=-xx*Math.sin(rot)+zz*Math.cos(rot);
    const y=yy*Math.cos(tilt)-z*Math.sin(tilt),depth=yy*Math.sin(tilt)+z*Math.cos(tilt);
    const perspective=2.9/(2.9-depth*.3);
    return {x:cx+x*radius*perspective,y:cy+y*radius*perspective,z:depth};
  });
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.35-mix*.4);ctx.strokeStyle='#00000022';ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(0,0,radius*1.4,radius*.48,0,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([2,7]);ctx.beginPath();ctx.ellipse(0,0,radius*1.52,radius*.68,.7,0,Math.PI*2);ctx.stroke();ctx.restore();
  for(const [i,j] of connections){const a=projected[i],b=projected[j];ctx.strokeStyle=`rgba(0,0,0,${.035+(a.z+b.z+2)*.045})`;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  projected.sort((a,b)=>a.z-b.z).forEach(p=>{const d=(p.z+1)/2;ctx.fillStyle=`rgba(0,0,0,${.2+d*.8})`;ctx.beginPath();ctx.arc(p.x,p.y,.6+d*1.65,0,Math.PI*2);ctx.fill();});
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#080808';ctx.font=`600 ${Math.round(radius*.38)}px "Space Grotesk",sans-serif`;ctx.fillText('ih',cx,cy);
  ctx.fillStyle='#555';ctx.font='8px monospace';ctx.fillText('IDEAS → SYSTEMS',cx,cy+radius*.29);
  if(entering||Math.abs(pointer.x-current.x)+Math.abs(pointer.y-current.y)>.003)requestDraw();
}
function requestDraw(){if(!frame&&!document.hidden)frame=requestAnimationFrame(drawTopology);}
function resizeTopology(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);requestDraw();}
canvas.addEventListener('pointermove',e=>{if(motionQuery.matches)return;const r=canvas.getBoundingClientRect();pointer={x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};requestDraw();});
canvas.addEventListener('pointerleave',()=>{pointer={x:0,y:0};requestDraw();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestDraw();});
motionQuery.addEventListener('change',()=>{pointer={x:0,y:0};requestDraw();});
new ResizeObserver(resizeTopology).observe(canvas);resizeTopology();
let scrollFrame=0;
function updateScroll(){scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;scrollMix=Math.max(0,Math.min(1,scrollY/650));const rect=canvas.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)requestDraw();}
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});updateScroll();

// Native buttons preserve touch and keyboard interaction alongside the 3D response.
buildCards.forEach(card=>{
  card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||motionQuery.matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);card.style.transform=`rotateX(${(y-.5)*-5}deg) rotateY(${(x-.5)*5}deg)`;});
  card.addEventListener('pointerleave',()=>{card.style.transform='';});
});
if('IntersectionObserver' in window&&!motionQuery.matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.section h2,.timeline article,.credentials article').forEach(e=>{e.classList.add('reveal');observer.observe(e);});
}
