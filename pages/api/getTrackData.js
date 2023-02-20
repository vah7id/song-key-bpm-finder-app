// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const scdl = require('soundcloud-downloader').default
const fs = require('fs')
const axios = require('axios').default
const path = require('path');
const cwd = path.join(__dirname, '..');

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '6233cf5397864e0abb091744ea919486',
    clientSecret: '5d967a86893f46299a46ea4c94695ddf',
    redirectUri: 'https://scfetch.app/api/callback'
});


export default function handler(req, res) {
    //spotifyApi.setAccessToken('BQAXwZmR8C_inD7iYX0ViC-RRDYPOhWuK5o-BMcQwm8VYrR0daYlu8FeZG1dgfYx5I1Y9CDy1a3elJ03Nge6R1VTeOCAK3wgTVKs6bunHBz0p1hPo8OQ0lNPQpPDN2vR5xHJU5E4hJVGEKjAEd4F5vxxUqccr6SDLpxlR0fBGfhx-cAfEUm0JCmTRelaligpu-xSDTh2KB9Xs0zZWWQ');
    //spotifyApi.setRefreshToken('AQANHsUmV4QS1XuB4cXUCIt2xKD4m1YN3fKuz4w4XSDeATenMTFEyDtpUoJ8JsxVg2OuaY0iEdawNGP7ucJGmp1PkBFipf4XXaPV52BdLY0cLAzjgCwlzUpf0DfxD707-E0');

    res.setHeader('Authorization', 'Basic ' + (new Buffer("6233cf5397864e0abb091744ea919486" + ':' + "5d967a86893f46299a46ea4c94695ddf").toString('base64')))
    res.setHeader('Content-Type', 'application/x-www-form-urlencoded')
   

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.getTrack(req.query.id).then(function(data) {
                if(!data.body) {
                    res.status(200).json({body: [], err: 'Oops!! it seems we cannot fetch this certain tracks data model atm!! Try to refresh the page :)'}); 
                }
                
                let resp = data.body;

                spotifyApi.getAudioFeaturesForTrack(data.body.id).then((featuresData) => {
                    resp.key = featuresData.body.key;
                    resp.tempo = featuresData.body.tempo;
                    resp.duration_ms = featuresData.body.duration_ms;
                    resp.mode = featuresData.body.mode;
                    resp.danceability = featuresData.body.danceability;
                    resp.energy = featuresData.body.energy;
                    resp.loudness = featuresData.body.loudness;
                    resp.happiness = featuresData.body.valence;
                    resp.instrumentalness = featuresData.body.instrumentalness
                    resp.time_signature = featuresData.body.time_signature

                    res.status(200).json(resp); 
                })

              },
              function(err) {
                console.log(err)
                res.status(200).json({body: [], err: 'Oops!! it seems we cannot fetch this certain tracks data model atm!! Try to refresh the page :)'}); 
             });
        },
        function(err) {
            res.status(200).json({body: [], err: 'AUTHORIZATION_REQUIRED'}); 
        });
   
  }
