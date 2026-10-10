const $ = id => document.getElementById(id);
const canvas = $("stage");
const ctx = canvas.getContext("2d");
let productImages = [];
let avatarImage = null;
let exportTimer = null;
let rafId = null;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({img, url});
    img.onerror = reject;
    img.src = url;
  });
}
function fitImage(img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale, sh = h / scale;
  const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
function roundedRect(x,y,w,h,r,fill) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill();
}
function wrapText(text, maxWidth, font) {
  ctx.font = font;
  const words = (text || "").split(/\s+/);
  const lines = []; let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
function drawCover() {
  const W=canvas.width,H=canvas.height;
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,"#fff6f5");g.addColorStop(.52,"#f8e5e9");g.addColorStop(1,"#f2dfc8");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgba(196,154,85,.25)";
  for(let i=0;i<15;i++){ctx.beginPath();ctx.arc((i*83)%W,(i*137)%H,4+(i%3)*2,0,Math.PI*2);ctx.fill();}
}
function drawTextCentered(text,y,font,color,maxWidth=W-90,lineGap=1.25) {
  const lines=wrapText(text,maxWidth,font);
  ctx.font=font;ctx.fillStyle=color;ctx.textAlign="center";ctx.textBaseline="middle";
  lines.forEach((line,i)=>ctx.fillText(line,canvas.width/2,y+(i-(lines.length-1)/2)*parseInt(font,10)*lineGap));
  return lines.length*parseInt(font,10)*lineGap;
}
function drawFrame(progress=0) {
  const W=canvas.width,H=canvas.height;
  drawCover();
  const brand=$("brand").value.trim() || "YOUR BRAND";
  const website=$("website").value.trim();
  const address=$("address").value.trim();
  const presenter=$("presenter").value.trim() || "Your Presenter";
  const slides=productImages.length ? productImages : [];
  const n=slides.length+2;
  const idx=Math.min(n-1,Math.floor(progress*n));
  const isEnd=idx===n-1;
  const isAvatar=avatarImage && idx===0;
  let y=80;
  ctx.fillStyle="#7f2446";ctx.textAlign="center";ctx.font="bold 23px Arial";
  ctx.fillText(brand.toUpperCase(),W/2,y);y+=38;
  ctx.fillStyle="#9c6d79";ctx.font="18px Arial";
  ctx.fillText("FASHION  •  JEWELLERY  •  GIFTS",W/2,y);
  if(!isEnd && slides.length && idx>0 && idx<=slides.length){
    fitImage(slides[idx-1].img,48,155,W-96,650);
    roundedRect(42,830,W-84,210,"#fffaf6");
    drawTextCentered(brand,875,"bold 32px Arial","#7f2446",W-130);
    drawTextCentered("Discover your favourite styles",940,"26px Arial","#35242a",W-130);
    drawTextCentered(website,995,"bold 22px Arial","#7f2446",W-130);
  } else if(isAvatar && avatarImage) {
    fitImage(avatarImage.img,80,155,W-160,610);
    roundedRect(42,800,W-84,235,"#fffaf6");
    drawTextCentered("Namaskara!",850,"bold 42px Arial","#7f2446");
    drawTextCentered("Welcome to",910,"28px Arial","#35242a");
    drawTextCentered(brand,965,"bold 29px Arial","#7f2446",W-110);
  } else if(isEnd) {
    ctx.strokeStyle="#c49a55";ctx.lineWidth=3;ctx.strokeRect(40,150,W-80,H-300);
    drawTextCentered("✦",340,"bold 72px Arial","#c49a55");
    drawTextCentered(brand,445,"bold 39px Arial","#7f2446",W-110);
    drawTextCentered("Discover Your Style",540,"italic 30px Georgia","#47333a",W-100);
    drawTextCentered("Fashion  •  Jewellery  •  Cosmetics  •  Gifts",650,"bold 20px Arial","#7f2446",W-100);
    const addrLines=wrapText(address,W-130,"24px Arial");
    ctx.font="24px Arial";ctx.fillStyle="#47333a";ctx.textAlign="center";
    addrLines.forEach((line,i)=>ctx.fillText(line,W/2,770+i*34));
    drawTextCentered(website,900,"bold 25px Arial","#7f2446",W-100);
    drawTextCentered("VISIT US TODAY",1000,"bold 22px Arial","#9c6d79");
  } else {
    drawTextCentered(presenter,360,"bold 44px Arial","#7f2446");
    drawTextCentered("Your AI brand presenter",425,"26px Arial","#47333a");
    drawTextCentered("Introduce your shop and products",535,"bold 31px Arial","#7f2446",W-110);
    drawTextCentered("Upload real product photos to personalise this video",650,"24px Arial","#47333a",W-120);
    roundedRect(55,790,W-110,160,"#fffaf6");
    drawTextCentered(brand,840,"bold 30px Arial","#7f2446",W-140);
    drawTextCentered(website,900,"22px Arial","#7f2446",W-120);
  }
  // Script text is shown as a short subtitle preview.
  const script=$("script").value.trim();
  if(script && !isEnd){
    const words=script.split(/\s+/);
    const sub=words.slice(Math.floor(progress*words.length),Math.floor(progress*words.length)+9).join(" ");
    roundedRect(28,H-180,W-56,118,"rgba(43,24,32,.88)");
    const lines=wrapText(sub,W-90,"bold 26px Arial");
    ctx.font="bold 26px Arial";ctx.fillStyle="#ffffff";ctx.textAlign="center";
    lines.slice(0,3).forEach((line,i)=>ctx.fillText(line,W/2,H-140+i*34));
  }
  ctx.fillStyle="#7f2446";ctx.font="bold 18px Arial";ctx.textAlign="center";
  ctx.fillText("MAA AI VIDEO STUDIO",W/2,H-28);
}
function updatePreview() {
  $("empty").style.display="none";
  $("photoCount").textContent=`${productImages.length} product photo${productImages.length===1?"":"s"}`;
  drawFrame(0.3);
  $("status").textContent="Preview updated. Export to create a downloadable slideshow-style video.";
}
$("photos").addEventListener("change", async e=>{
  productImages=[];
  for(const file of [...e.target.files].slice(0,12)){
    try{productImages.push(await loadImage(file));}catch{}
  }
  updatePreview();
});
$("avatar").addEventListener("change",async e=>{
  const f=e.target.files[0]; if(!f)return;
  try{avatarImage=await loadImage(f);updatePreview();}catch{$("status").textContent="Could not load that presenter image.";}
});
$("previewBtn").addEventListener("click",updatePreview);

$("exportBtn").addEventListener("click",async()=>{
  if(!("captureStream" in canvas) || !window.MediaRecorder){
    $("status").textContent="Video export is not supported by this browser. Try Chrome on a computer, or use the preview as a guide for an editor.";
    return;
  }
  $("exportBtn").disabled=true;
  $("status").textContent="Preparing video… keep this page open until export finishes.";
  const seconds=Number($("duration").value);
  const fps=24;
  const stream=canvas.captureStream(fps);
  let mime="video/webm;codecs=vp9";
  if(!MediaRecorder.isTypeSupported(mime)) mime="video/webm";
  let recorder;
  try{recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3500000});}
  catch(e){recorder=new MediaRecorder(stream);}
  const chunks=[];
  recorder.ondataavailable=e=>{if(e.data && e.data.size)chunks.push(e.data);};
  recorder.onerror=()=>{
    $("status").textContent="Export failed in this browser. Try a supported browser or export on a computer.";
    $("exportBtn").disabled=false;
  };
  recorder.onstop=()=>{
    const blob=new Blob(chunks,{type:recorder.mimeType||"video/webm"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="maa-ai-promo.webm";document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
    stream.getTracks().forEach(t=>t.stop());
    $("status").textContent="Video downloaded. This starter exports WebM; convert to MP4 if your social platform requires it.";
    $("exportBtn").disabled=false;
  };
  let start=performance.now();
  recorder.start(250);
  function frame(now){
    const p=Math.min(1,(now-start)/(seconds*1000));
    drawFrame(p);
    if(p<1) rafId=requestAnimationFrame(frame);
    else recorder.stop();
  }
  rafId=requestAnimationFrame(frame);
});
