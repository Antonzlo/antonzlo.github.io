async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 1500 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  }


async function getToys(ip = '127-0-0-1', port = 30010) {
    return fetch('https://'+ip+'.lovense.club:'+port+'/GetToys').then(async e => {
		e = await e.json();
	    window.toys = JSON.parse(e.data.toys);
        return window.toys;
    });
}

function parseToys(toys) {
    return Object.keys(toys).map(x=>
        x.status == 0 ? `<gr style='color:gray'>${toys[x].name}${toys[x].nickName ? ` (${toys[x].nickName})` : ''} - ${toys[x].battery}%</gr>` : `${toys[x].name}${toys[x].nickName ? ` (${toys[x].nickName})` : ''} - ${toys[x].battery}%`
    ).join('<br>');
}

async function run(ip = '127-0-0-1', port = 30010, cmd = { command:"Function", action:'Vibrate:0', timeSec:0, apiVer:1 }) {
    return fetch('https://'+ip+'.lovense.club:'+port+'/Command',{
	    method: 'post',
	    body: JSON.stringify(cmd)
    }).then(e=>e.json());
}

async function findPort(ip = '127-0-0-1') {
    let port = 30010, out = 0;
    do {
       out = await checkPort(ip, port) ? port : false;
    } while (port++ < 30015 && !out);
    return out || false;
}
async function checkPort(ip = '127-0-0-1', port = 30010) {
    return fetchWithTimeout('https://'+ip+'.lovense.club:'+port+'/GetToys')
    .then(async e => {
        e = await e.json();
        window.toys = (e.data?.toys||e.data||'{}');
        if(typeof window.toys == 'string') window.toys = JSON.parse(window.toys);
        return true;
    }).catch(()=>false).finally((e)=>e);
}