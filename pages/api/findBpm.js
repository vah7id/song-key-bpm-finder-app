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

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default function handler(req, res) {
    //spotifyApi.setAccessToken('BQAXwZmR8C_inD7iYX0ViC-RRDYPOhWuK5o-BMcQwm8VYrR0daYlu8FeZG1dgfYx5I1Y9CDy1a3elJ03Nge6R1VTeOCAK3wgTVKs6bunHBz0p1hPo8OQ0lNPQpPDN2vR5xHJU5E4hJVGEKjAEd4F5vxxUqccr6SDLpxlR0fBGfhx-cAfEUm0JCmTRelaligpu-xSDTh2KB9Xs0zZWWQ');
    //spotifyApi.setRefreshToken('AQANHsUmV4QS1XuB4cXUCIt2xKD4m1YN3fKuz4w4XSDeATenMTFEyDtpUoJ8JsxVg2OuaY0iEdawNGP7ucJGmp1PkBFipf4XXaPV52BdLY0cLAzjgCwlzUpf0DfxD707-E0');

    res.setHeader('Authorization', 'Basic ' + (new Buffer("6233cf5397864e0abb091744ea919486" + ':' + "5d967a86893f46299a46ea4c94695ddf").toString('base64')))
    res.setHeader('Content-Type', 'application/x-www-form-urlencoded')
   

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.search(req.query.title, ['track'], { limit : 50, offset : 1 }).then(function(data) {
                if(!data.body.tracks || data.body.tracks.items.length === 0) {
                    res.status(200).json({data: []}); 
                }
        
                const tracks = data.body.tracks.items;

                tracks.forEach(async(track, index) => {
                    spotifyApi.getAudioFeaturesForTrack(track.id).then(async(featuresData) => {
                        tracks[index].key = featuresData.body.key;
                        tracks[index].tempo = featuresData.body.tempo;
                        tracks[index].duration_ms = featuresData.body.duration_ms;
                        tracks[index].mode = featuresData.body.mode;
                        tracks[index].danceability = featuresData.body.danceability;
                        tracks[index].energy = featuresData.body.energy;
                        tracks[index].loudness = featuresData.body.loudness;
                        tracks[index].happiness = featuresData.body.valence;
                        tracks[index].instrumentalness = featuresData.body.instrumentalness
                        tracks[index].time_signature = featuresData.body.time_signature
                        await sleep(2000);

                        if(index === tracks.length - 1) {
                            res.status(200).json(tracks); 
                        }
                    })
                    await sleep(1000);
                });
              },
              function(err) {
                console.log(err)
                res.status(400).json({err: err, data: []}); 
             });
        },
        function(err) {
            res.status(200).json({err: err, data: []}); 
        });
   
  }
