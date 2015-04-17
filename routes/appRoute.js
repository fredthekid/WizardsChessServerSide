var play = function(req,res){
    res.render('play');
}

var home = function(req, res){
    console.log("Someone has accessed page");
    res.render('home');
}

exports.setRoute = function(appVar){
    appVar.get('/', home);
    appVar.get('/play', play);
};
