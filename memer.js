const webcam = document.getElementById('webcam');
const captureStage = document.getElementById('captureStage');
const resultStage = document.getElementById('resultStage');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const toggleAudioBtn = document.getElementById('toggleAudioBtn');
const audioStatusIcon = document.getElementById('audioStatusIcon');
const audioStatusText = document.getElementById('audioStatusText');
const fileUpload = document.getElementById('fileUpload');


const memeVideo = document.getElementById('memeVideo');


const zoomSlider = document.getElementById('zoomSlider');
const offsetYSlider = document.getElementById('offsetYSlider');
const offsetXSlider = document.getElementById('offsetXSlider');
const guideRing = document.getElementById('guideRing');

const memeCanvas = document.getElementById('memeCanvas');
const ctx = memeCanvas.getContext('2d');
const cropCanvas = document.getElementById('cropCanvas');
const cropCtx = cropCanvas.getContext('2d');

let currentStream = null;
let croppedFaceImage = null;
let animationFrameId = null;
let uploadedImage = null;



let isMuted = false;


async function setupCamera() {
    try {
      currentStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
  
      webcam.srcObject = currentStream;
  
      await webcam.play();
  
      console.log('Webcam started successfully');
    } catch (err) {
      console.error('Webcam error:', err);
      alert('Could not access your camera. Please allow camera permissions and try again.');
    }
  }
  
function updateGuideRing() {
  const zoom = zoomSlider.value;
  const offY = offsetYSlider.value;
  const offX = offsetXSlider.value;
  guideRing.style.transform = `translate(${offX}px, ${offY}px) scale(${zoom})`;
}

zoomSlider.addEventListener('input', updateGuideRing);
offsetYSlider.addEventListener('input', updateGuideRing);
offsetXSlider.addEventListener('input', updateGuideRing);

function isolateFace() {
    const vW = webcam.videoWidth || 640;
    const vH = webcam.videoHeight || 480;
  
    cropCanvas.width = vW;
    cropCanvas.height = vH;
  
    cropCtx.setTransform(1, 0, 0, 1, 0, 0);
    cropCtx.clearRect(0, 0, vW, vH);
  
    if (uploadedImage) {
      cropCtx.drawImage(uploadedImage, 0, 0, vW, vH);
    } else {
     
      cropCtx.save();
      cropCtx.translate(vW, 0);
      cropCtx.scale(-1, 1);
      cropCtx.drawImage(webcam, 0, 0, vW, vH);
      cropCtx.restore();
    }
  
    const zoom = parseFloat(zoomSlider.value);
    const offY = parseFloat(offsetYSlider.value);
    const offX = parseFloat(offsetXSlider.value);
  
    const radiusX = (vW * 0.18) * zoom;
    const radiusY = (vH * 0.26) * zoom;
  
    const centerX = (vW / 2) - offX;
    const centerY = (vH / 2) + offY;
  
    const cropX = Math.max(0, centerX - radiusX * 1.2);
    const cropY = Math.max(0, centerY - radiusY * 1.2);
    const cropW = Math.min(vW - cropX, radiusX * 2.4);
    const cropH = Math.min(vH - cropY, radiusY * 2.4);
  
    const outCanvas = document.createElement('canvas');
  
    outCanvas.width = cropW;
    outCanvas.height = cropH;
  
    const oCtx = outCanvas.getContext('2d');
  
    oCtx.beginPath();
    oCtx.ellipse(
      cropW / 2,
      cropH / 2,
      cropW * 0.42,
      cropH * 0.48,
      0,
      0,
      Math.PI * 2
    );
  
    oCtx.clip();
  
    oCtx.drawImage(
      cropCanvas,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    );
  
    const img = new Image();
  
    img.src = outCanvas.toDataURL('image/png');
  
    return img;
    }
  



    function startGGEZMusic() {
        if (isMuted) return;
      
        memeVideo.muted = false;
        memeVideo.volume = 1.0;
      
        memeVideo.play().catch(err => {
          console.warn('Meme video audio could not start:', err);
        });
      }
      
      function stopGGEZMusic() {
        memeVideo.pause();
        memeVideo.currentTime = 0;
      }
      

class GGAnimationEngine {
  constructor(canvas, faceImage) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.faceImg = faceImage;
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.frame = 0;

    this.confetti = Array.from({ length: 50 }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height - this.canvas.height,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      speedY: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      color: ['#10b981', '#06b6d4', '#ec4899', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)]
    }));
  }

  render() {
    this.frame++;
    const t = this.frame * 0.06;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (memeVideo.readyState >= 2) {
        this.ctx.drawImage(
          memeVideo,
          0,
          0,
          w,
          h
        );
      } else {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, w, h);
      }

    this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    this.ctx.lineWidth = 2;
    const offset = (this.frame * 4) % 40;
    for (let x = 0; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = offset; y < h; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    this.confetti.forEach(p => {
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      if (p.y > h) p.y = -20;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rot * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.ctx.restore();
    });

    const charX = w / 2 + Math.sin(t * 1.5) * 90;
    const charY = h / 2 + 20 + Math.abs(Math.sin(t * 3)) * -30;

    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(charX, charY);
    this.ctx.lineTo(charX, charY + 100);
    this.ctx.stroke();

    const arm1 = Math.sin(t * 3) * 0.9;
    const arm2 = Math.cos(t * 3) * 0.9;
    this.ctx.beginPath();
    this.ctx.moveTo(charX, charY + 20);
    this.ctx.lineTo(charX - 60 * Math.cos(arm1), charY - 40 * Math.sin(arm1));
    this.ctx.moveTo(charX, charY + 20);
    this.ctx.lineTo(charX + 60 * Math.cos(arm2), charY + 40 * Math.sin(arm2));
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(charX, charY + 100);
    this.ctx.lineTo(charX - 40 + Math.sin(t * 3) * 20, charY + 180);
    this.ctx.moveTo(charX, charY + 100);
    this.ctx.lineTo(charX + 40 - Math.sin(t * 3) * 20, charY + 180);
    this.ctx.stroke();

    const headW = 150;
    const headH = 180;
    const headAngle = Math.sin(t * 2) * 0.25;

    this.ctx.save();
    this.ctx.translate(charX, charY - 60);
    this.ctx.rotate(headAngle);

    if (this.faceImg && this.faceImg.complete) {
      this.ctx.shadowColor = '#10b981';
      this.ctx.shadowBlur = 18;
      this.ctx.drawImage(this.faceImg, -headW / 2, -headH / 2, headW, headH);
      this.ctx.shadowBlur = 0;

    //   this.ctx.fillStyle = '#000000';
    //   this.ctx.fillRect(-headW * 0.35, -headH * 0.1, headW * 0.7, headH * 0.2);
    //   this.ctx.fillStyle = '#ffffff';
    //   this.ctx.fillRect(-headW * 0.25, -headH * 0.08, headW * 0.12, headH * 0.05);
    //   this.ctx.fillRect(headW * 0.08, -headH * 0.08, headW * 0.12, headH * 0.05);
    }
    this.ctx.restore();

    this.ctx.save();
    this.ctx.font = '900 60px monospace';
    this.ctx.textAlign = 'center';
    
    const textY = 100 + Math.sin(t * 4) * 15;
    this.ctx.strokeStyle = `hsl(${(this.frame * 6) % 360}, 100%, 50%)`;
    this.ctx.lineWidth = 12;
    this.ctx.strokeText('GG EZ !', w / 2, textY);

    // this.ctx.fillStyle = '#ffffff';
    // this.ctx.fillText('GG EZ !', w / 2, textY);
    // this.ctx.restore();
  }
}

let engine = null;

captureBtn.addEventListener('click', () => {

    const faceImg = isolateFace();
  
    faceImg.onload = () => {
  
      croppedFaceImage = faceImg;
  
      captureStage.classList.add('hidden');
      resultStage.classList.remove('hidden');
  
     
      memeVideo.currentTime = 0;
      memeVideo.muted = false;
      memeVideo.volume = 1.0;
  
      memeVideo.play().catch(err => {
        console.error('Meme video playback failed:', err);
      });
  
      
      engine = new GGAnimationEngine(
        memeCanvas,
        croppedFaceImage
      );
  
      function loop() {
        engine.render();
        animationFrameId = requestAnimationFrame(loop);
      }
  
      loop();
    };
  });
  
  

fileUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      uploadedImage = img;
      alert('Photo uploaded successfully! Adjust settings if needed and click CAPTURE FACE.');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

retakeBtn.addEventListener('click', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  
    stopGGEZMusic();
  
    memeVideo.pause();
    memeVideo.currentTime = 0;
  
    resultStage.classList.add('hidden');
    captureStage.classList.remove('hidden');
  });

  toggleAudioBtn.addEventListener('click', () => {
    isMuted = !isMuted;
  
    if (isMuted) {
      memeVideo.muted = true;
      audioStatusText.textContent = 'Unmute Audio';
    } else {
      memeVideo.muted = false;
      audioStatusText.textContent = 'Mute Audio';
  
      memeVideo.play().catch(err => {
        console.warn('Could not resume video:', err);
      });
    }
  });
  


window.onload = () => {
  setupCamera();
  updateGuideRing();
};