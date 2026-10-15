#!/usr/bin/env python3
"""Import a strictly allowlisted legacy public catalog into HAVY5 LAB.
No credentials, financial data, stock quantities, internal notes or customer info.
"""
import json, re, hashlib, unicodedata, argparse
from pathlib import Path
from urllib.parse import unquote, urlsplit
from PIL import Image, ImageOps

def slug(s):
    t=unicodedata.normalize("NFD",str(s))
    t="".join(ch for ch in t if unicodedata.category(ch)!="Mn")
    t=t.lower().replace("đ","d")
    return re.sub(r"[^a-z0-9]+","-",t).strip("-") or "san-pham"

def clean(s, n=190):
    return re.sub(r"\s+"," ",str(s or "").strip())[:n]

def convert_asset(url, image_root, output_dir, prefix, number):
    if not url or not isinstance(url,str):
        return None
    # Only use the known, archived Supabase PUBLIC object bucket.
    parsed=urlsplit(url)
    if parsed.hostname!="lkvewrcyyjbsfqduhvep.supabase.co" or "/storage/v1/object/public/product-images/" not in parsed.path:
        return None
    rel=unquote(parsed.path.split("/storage/v1/object/public/",1)[1])
    candidate=(image_root/rel).resolve()
    root=image_root.resolve()
    if root not in candidate.parents or not candidate.is_file():
        return None
    orig_hash=hashlib.sha256(candidate.read_bytes()).hexdigest()
    destination=output_dir/(prefix+"-"+str(number)+".webp")
    try:
        with Image.open(candidate) as image:
            image=ImageOps.exif_transpose(image)
            image.thumbnail((1200,1200),Image.Resampling.LANCZOS)
            if image.mode!="RGB":
                background=Image.new("RGB",image.size,"#f3f0e9")
                if image.mode in ("RGBA","LA"):
                    background.paste(image,mask=image.getchannel("A"))
                else:background.paste(image.convert("RGB"))
                image=background
            image.save(destination,"WEBP",quality=79,method=5)
        return {"path":"/catalog-assets/"+destination.name,"originalSha256":orig_hash[:16],"kind":"legacy-public-image"}
    except Exception as e:
        print("IMAGE_SKIP",candidate.name,str(e)[:150])
        return None

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--source",required=True)
    parser.add_argument("--target",required=True)
    args=parser.parse_args()
    src=Path(args.source).resolve()
    root=Path(args.target).resolve()
    data=src/"_report"/"HAVY5_KE_THUA_SAN_PHAM"/"data"
    archive=src/"_snapshots"/"lkvew-aug"/"storage"
    f=json.loads((data/"product_families.json").read_text(encoding="utf-8-sig"))
    v=json.loads((data/"product_variants.json").read_text(encoding="utf-8-sig"))
    dest=root/"src"/"catalog-data.json"
    image_dest=root/"public"/"catalog-assets"
    image_dest.mkdir(parents=True,exist_ok=True)
    family_list=[]
    sku_paths=set()
    used_variants=set()
    for p in f:
        name=clean(p.get("display_name"),160)
        sku=clean(p.get("sku"),70)
        ident=str(p.get("id"))
        if not name or not sku or ident=="None":continue
        unique=slug(p.get("family_slug") or name)
        if unique in sku_paths:unique=unique+"-"+slug(sku)
        sku_paths.add(unique)
        variants=[]
        for row in v:
            if row.get("family_id")!=ident:continue
            # Keep historical rows but without any price/stock claims.
            vsku=clean(row.get("sku"),75)
            if not vsku or vsku in used_variants:
                raise RuntimeError("Missing or duplicate variant SKU: "+vsku)
            used_variants.add(vsku)
            variants.append({
               "sku":vsku,"slug":slug(vsku),"label":clean(row.get("variant_label"),120),
               "thickness":clean(row.get("thickness"),50),
               "dimensions":clean(row.get("dimensions"),70),
               "brand":clean(row.get("brand"),75)
            })
        urls=[p.get("main_image_url")]+list(p.get("gallery_images") or [])
        if not any(urls):
            for row in v:
                if row.get("family_id")==ident:
                    urls += [row.get("image_url")]+list(row.get("images") or [])

        seen=set()
        images=[]
        for url in urls:
            if url in seen:continue
            seen.add(url)
            asset=convert_asset(url,archive,image_dest,slug(sku),len(images)+1)
            if asset:images.append(asset)
            if len(images)>=4:break
        family_list.append({
            "sku":sku,"slug":unique,"title":name,
            "group":clean(p.get("product_group"),90),
            "image":images[0]["path"] if images else "",
            "gallery":[x["path"] for x in images],
            "photoEvidence":[x["originalSha256"] for x in images],
            "variants":sorted(variants,key=lambda x:x["sku"]),
            "historical":True
        })
    family_list.sort(key=lambda x:(x["group"].lower(),x["title"].lower()))
    out={"source":"Ha Vy archived public catalog snapshot, read-only, Oct 2026; source records dated May-Jun 2026",
         "disclaimer":"Historical SKU, brand, thickness and dimensions are for identification only. No live price, stock or technical certification.",
         "families":family_list}
    dest.write_text(json.dumps(out,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print(json.dumps({"families":len(family_list),
        "variants":sum(len(x["variants"]) for x in family_list),
        "familiesWithImage":sum(bool(x["image"]) for x in family_list),
        "imageFiles":len(list(image_dest.glob("*.webp"))),
        "imageBytes":sum(x.stat().st_size for x in image_dest.glob("*.webp")),
        "dataBytes":dest.stat().st_size,
        "missingImage":[x["sku"] for x in family_list if not x["image"]]},ensure_ascii=False))

if __name__=="__main__":main()
