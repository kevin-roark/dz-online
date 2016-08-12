
let media = require('./dz_media.json');
let oldMedia = require('./dz_media_november.json');

console.log(`media length: ${media.length}`);
console.log(`old media length: ${oldMedia.length}`);
console.log(`diff: ${media.length - oldMedia.length}`);

let newestOldMedia = oldMedia[0];
var indexOfOldMedia;

for (indexOfOldMedia = 0; indexOfOldMedia < media.length; indexOfOldMedia++) {
  let el = media[indexOfOldMedia];
  if (el.id === newestOldMedia.id) {
    break;
  }
}

console.log(`index of newest old media in media: ${indexOfOldMedia}`);

let elementsToReverse = media.slice(0, indexOfOldMedia);
elementsToReverse.reverse();

let newMedia = elementsToReverse.concat(oldMedia);
console.log(`fixed media length: ${newMedia.length}`);

let fs = require('fs');
fs.writeFileSync('fixed_dz_media.json', JSON.stringify(newMedia));
