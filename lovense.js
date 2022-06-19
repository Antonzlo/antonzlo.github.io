async function getToys(ip = '127-0-0-1', port = 30010) {
    return fetch('https://'+ip+'.lovense.club:'+port+'/GetToys').then(async e => {
		e = await e.json();
	    window.toys = JSON.parse(e.data.toys);
        return window.toys;
    });
}

function parseToys(toys) {
    return Object.keys(toys).map(x=>
        `${toys[x].name}${toys[x].nickname ? ` (${toys[x].nickname})` : ''} - ${toys[x].battery}%`
    ).join('<br>');
}

async function run(ip = '127-0-0-1', port = 30010, cmd = { command:"Function", action:'vibrate:0', timeSec:0, apiVer:1 }) {
    return fetch('https://'+ip+'.lovense.club:'+port+'/command',{
	    method: 'post',
	    body: JSON.stringify(cmd)
    }).then(e=>e.json());
}

async function findPort(ip = '127-0-0-1') {
    let port = 30010, out = 0;
    do {
       out = await checkPort(ip, port) ? port : false;
    } while (port++ < 30013 && !out);
    return out || false;
}
async function checkPort(ip = '127-0-0-1', port = 30010) {
    return fetch('https://'+ip+'.lovense.club:'+port+'/GetToys', { timeout:3000 })
    .then(async e => {
        e = await e.json();
        window.toys = JSON.parse(e.data?.toys||'{}');
        return true;
    }).catch(()=>false).finally((e)=>e);
}