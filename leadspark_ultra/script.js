document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');
  const stripeBtn = document.getElementById('stripeBtn');
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();
  function setTheme(isDark){ if(isDark) document.documentElement.classList.add('dark'), themeToggle.textContent='Light'; else document.documentElement.classList.remove('dark'), themeToggle.textContent='Dark'; }
  setTheme(localStorage.getItem('dark')==='1');
  themeToggle.addEventListener('click', ()=>{ const d = !document.documentElement.classList.contains('dark'); setTheme(d); localStorage.setItem('dark', d?'1':'0'); });
  if(window.gsap){ gsap.from('h1',{y:20,opacity:0,duration:0.7}); gsap.from('img',{scale:0.98,opacity:0,duration:0.9,delay:0.2}); }
  function validate(d){ const errs=[]; if(!d.name||d.name.trim().length<2) errs.push('Name too short'); if(!d.email||!/\S+@\S+\.\S+/.test(d.email)) errs.push('Invalid email'); if(!document.getElementById('agree').checked) errs.push('Consent required'); return errs; }
  form.addEventListener('submit', async (e)=>{ e.preventDefault(); msg.textContent=''; submitBtn.disabled=true; const data={name:form.name.value.trim(),email:form.email.value.trim(),company:form.company.value.trim(),phone:form.phone.value.trim(),message:form.message.value.trim()}; const errs=validate(data); if(errs.length){ msg.textContent=errs.join('; '); submitBtn.disabled=false; return; } try{ const r=await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); const j=await r.json(); if(r.ok){ msg.textContent='Thanks — we will contact you!'; form.reset(); } else msg.textContent=j.error||'Server error'; }catch(e){ msg.textContent='Network error'; } submitBtn.disabled=false; });
  stripeBtn.addEventListener('click', async ()=>{ stripeBtn.disabled=true; try{ const r=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceId:'price_demo'})}); const j=await r.json(); if(r.ok && j.sessionId){ const stripe = Stripe(j.publishableKey||''); await stripe.redirectToCheckout({sessionId:j.sessionId}); } else alert(j.error || 'Stripe not configured. See README.'); }catch(e){ alert('Stripe error'); } stripeBtn.disabled=false; });
}); 