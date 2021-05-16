
// 2021 Created by dr Avicenna
// For Future Readers. Im not a JS programmer, so dont kill me for this code.

// TODO use API to all coloboks here
// https://wax.simplemarket.io/api/v2/market?skip=30&limit=30&&authors=ilovekolobok&categories=kolobok&asset.mdata.health.raw=100&sortOrder=1&isVerifiedOnly=true

function calc(e) {
    // Calculate speed and stealth
    if (e != "" || e !== undefined) {
        const t = e.length;
        const n = e.length / 2;
        const l = [e.slice(0, 2), e.slice(t - 2, t)];
        const r = [e.slice(n - 2, n), e.slice(n, n + 2)];

        var speed = Math.abs(parseInt(l[0], 16) - parseInt(l[1], 16));
        var stealth = ((255 - Math.abs(parseInt(r[0], 16) - parseInt(r[1], 16))) / 255).toFixed(2);
        console.log(stealth)
        console.log(speed)
        }
    else {
        stealth = ''
        speed = ''
    }
    return [stealth, speed.toString()]
} 


async function get_and_paste_info(card) {
    // Get info about Kolobok and insert it into card
    try {
        var k_id = card.href.split('/').pop()
        var koloGenome = await callKolobok(k_id)
    }
    catch(e) {
        console.log(e)
        koloGenome = ""
    }

    if (koloGenome != "") {
        var stealth_speed = calc(koloGenome)
    }
    if (stealth_speed[0] != "") {
        // Set Stealth color
        if (stealth_speed[0] >= 0 && stealth_speed[0] < 0.3) {
            stealth_speed[0] = stealth_speed[0].fontcolor("red")
        }
        if (stealth_speed[0] >= 0.3 && stealth_speed[0] < 0.65) {
            stealth_speed[0] = stealth_speed[0].fontcolor("orange")
        }
        if (stealth_speed[0] >= 0.65 && stealth_speed[0] <= 1) {
            stealth_speed[0] = stealth_speed[0].fontcolor("green")
        }
        // Set Speed color
        if (stealth_speed[1] >= 0 && stealth_speed[1] < 85) {
            stealth_speed[1] = stealth_speed[1].fontcolor("red")
        }
        if (stealth_speed[1] >= 85 && stealth_speed[1] < 170) {
            stealth_speed[1] = stealth_speed[1].fontcolor("orange")
        }
        if (stealth_speed[1] >= 170 && stealth_speed[1] <= 255) {
            stealth_speed[1] = stealth_speed[1].fontcolor("green")
        }
        try {
            var string_to_write = "<p> SP: " + stealth_speed[1] + " ST: "+ stealth_speed[0] + "</p>"
            card.insertAdjacentHTML('beforeend',  string_to_write)
        }
        catch (e) {
            console.log(e)
        }
    
    }
}
async function process_cards(){
    // Loop to process each card
    var stealth_speed = ["", ""]
    var cards = document.getElementsByClassName("title-link") // "title-link ng-star-inserted"

    for (var i = 0, l = cards.length; i < l; i++) {
        if (cards[i].getElementsByTagName('p').length < 1 ) {
            get_and_paste_info(cards[i]);
        }
        await sleep(50)
    }
}
async function callKolobok(idkolobok) {
    // var url = 'https://wax.simplemarket.io/api/v1/item/100000007068519';
    var url = 'https://wax.simplemarket.io/api/v1/item/'+idkolobok;
    console.log(url)
    var param = {
        method: "post"
    };

    return fetch(url, param)
        .then(resp => {
            if (resp.status === 200) {
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            var kolodata = JSON.parse(dataJson.idata);
            var genome = kolodata.genome;
            console.log(kolodata)
            console.log(genome)
            return genome
        })
        .catch(err => {
            if (err === "server") return console.log(err)
        })
}   

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
// Callback function to execute when mutations are observed
const UpdateCards = async function(mutationsList) {
    await sleep(500);
    await process_cards();
    // for(var mutation of mutationsList) {
        //     if (mutation.type == 'childList') {
            //         console.log('A child node has been added or removed.');
            //     }
            //     else if (mutation.type == 'attributes') {
//         console.log('The ' + mutation.attributeName + ' attribute was modified.');
//     }
// }
};
async function start() {
    await sleep(500)
    await process_cards();
    var allBodyNode = document.body.getElementsByClassName('col-gap ng-star-inserted').item(0);
    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: false };
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(UpdateCards);
    // Start observing the target node for configured mutations
    observer.observe(allBodyNode, config);
}

start()