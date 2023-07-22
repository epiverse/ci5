// ci5 data retrieval ES6 module

const loaded=Date()

async function getZipURL(url='https://corsproxy.io/?https://ci5.iarc.fr/CI5plus/old/CI5plus_Summary_April2019.zip'){
    const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip/+esm')).default
    let res={}
    try {
        let response = await fetch(url);
        let blob = await response.blob();
        var zip = new JSZip();
        let newZip = await zip.loadAsync(blob);
        let promises = [];
        newZip.forEach((relativePath, file) => {
            let promise = file.async("uint8array").then((content) => {
                console.log("File:", relativePath, "Size:", content.byteLength);
                let txt = (new TextDecoder()).decode(content)
                let trailingBlank = txt.match(/[/\n/\r]+$/g)
                if(trailingBlank){
                    txt=txt.slice(0,-(trailingBlank.length+1))
                }
                res[relativePath]=(txt).split(/[\n\r]+/g).map(r=>r.split(/[\t,]/g))
            });
            promises.push(promise);
        });
        await Promise.all(promises);
    }
    catch(err) {
        console.log("Error:", err);
    }
    return res;
}

export{
    loaded,
    getZipURL
}
