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
   
    console.log(req.query.qs)
    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.getRecommendations(JSON.parse(req.query.qs)).then(function(data) {
                if(!data.body || !data.body.tracks || data.body.tracks.length === 0) {
                    res.status(200).json([]); 
                }
                let resp = data.body.tracks;

                data.body.tracks.forEach((track, index) => {
                    spotifyApi.getAudioFeaturesForTrack(track.id).then((featuresData) => {
                        console.log(featuresData.body)
                        resp[index].key = featuresData.body.key;
                        resp[index].tempo = featuresData.body.tempo;
                        resp[index].duration_ms = featuresData.body.duration_ms;
                        resp[index].mode = featuresData.body.mode;
                        resp[index].danceability = featuresData.body.danceability;
                        resp[index].energy = featuresData.body.energy;
                        resp[index].loudness = featuresData.body.loudness;
                        resp[index].happiness = featuresData.body.valence;
                        resp[index].instrumentalness = featuresData.body.instrumentalness
                        resp[index].time_signature = featuresData.body.time_signature

                        if(index === resp.length - 1) {
                            res.status(200).json(resp); 
                        }
                    })
                })
              },
              function(err) {
                console.log(err)
                res.status(200).json([]);   
             });
        },
        function(err) {
            res.status(200).json([]);   
        });
   
  }