import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const mimes = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const port = Number(process.env.PORT || 4173);
http.createServer(async(req,res)=>{
  try {
    const path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const candidate = resolve(root, '.' + path, path.endsWith('/')?'index.html':'');
    if (candidate!==root && !candidate.startsWith(root+sep)) throw new Error('Forbidden');
    let target=candidate;
    try { if(!extname(target)) { target=join(target,'index.html'); } var data=await readFile(target); }
    catch { res.writeHead(404);res.end('404');return; }
    res.writeHead(200, {'content-type':mimes[extname(target)]||'application/octet-stream','cache-control':'no-store'});res.end(data);
  }catch{res.writeHead(400);res.end('Bad request');}
}).listen(port,()=>console.log(`HAVY5 LAB http://localhost:${port}`));
