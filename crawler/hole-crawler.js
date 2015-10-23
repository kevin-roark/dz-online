
var fs = require('fs');
var request = require('superagent');
var secrets = require('./secrets');

var instagramClient = require('./instagram');
instagramClient.init(secrets.INSTAGRAM_CLIENT_ID, secrets.INSTAGRAM_CLIENT_SECRET);

// u can change this, dummy
var locationToCrawl = '212943401';
var outputFilename = './crawled_media.json';

main();

function writeFile(data, callback) {
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }

  fs.writeFile(outputFilename, data, function(err) {
    if (err) {
      console.log('error saving data:');
      console.log(err);
    }
    else {
      console.log('saved to: ' + outputFilename);
    }

    if (callback) {
      callback(err);
    }
  })
}

function main() {
  var mediaList = [];

  instagramClient.locationMedia(locationToCrawl, function(err, res) {
    if (err) {
      console.log('instagram error:');
      console.log(err);
    }
    else {
      handleResponse(res);
    }
  });

  function handleResponse(res) {
    console.log('handling chill response...');
    collectData(res.data);
    writeFile(mediaList);

    var nextPageURL = res.pagination.next_url;
    if (nextPageURL) {
      request
        .get(nextPageURL)
        .end(function(err, apiResponse) {
          if (err) {
            console.log('instagram error:');
            console.log(err);
          }
          else {
            setTimeout(function() {
              handleResponse(apiResponse.body);
            }, 6666); // to get around rate-limiting make this artificially slow
          }
        });
    }
    else {
      console.log('I am all done!');
      process.exit();
    }
  }

  function collectData(data) {
    var compressedMedia = instagramClient.compress(data);
    compressedMedia.forEach(function(media) {
      mediaList.push(media);
    });
  }

}
