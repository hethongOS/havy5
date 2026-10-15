
const query=document.getElementById('legacyQuery');
const group=document.getElementById('legacyGroup');
if(query&&group){
 const cards=[...document.querySelectorAll('[data-catalog-item]')];
 const update=()=>{
  const q=query.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const g=group.value;
  let visible=0;
  for(const card of cards){
   const search=(card.dataset.search||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
   const match=(!g||card.dataset.group===g)&&(!q||search.includes(q));
   card.hidden=!match;
   if(match)visible++;
  }
  const status=document.getElementById('legacyResults');
  if(status)status.textContent=visible+' dòng vật liệu';
  const missing=document.getElementById('legacyNoResults');
  if(missing)missing.hidden=visible!==0;
 };
 query.addEventListener('input',update);group.addEventListener('change',update);
}
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{
 const target=document.getElementById('legacyMainPhoto');
 const main=target?.querySelector('img');
 const src=button.dataset.photo;
 if(main&&src&&src.startsWith('/catalog-assets/'))main.src=src;
}));
document.querySelectorAll('[data-copy-sku]').forEach(button=>button.addEventListener('click',async()=>{
 const sku=button.dataset.copySku;
 if(!sku)return;
 try{
  await navigator.clipboard.writeText(sku);
  button.textContent='Đã sao chép';
 }catch{
  button.textContent='Mã: '+sku;
 }
}));
