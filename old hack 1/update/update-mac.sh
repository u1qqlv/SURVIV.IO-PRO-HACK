echo Updating
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
curl -o $DIR/../ChromeExtension/init.js https://raw.githubusercontent.com/ALiangLiang/SurvivHacks/master/ChromeExtension/init.js
curl -o $DIR/../ChromeExtension/background.js https://raw.githubusercontent.com/ALiangLiang/SurvivHacks/master/ChromeExtension/background.js
curl -o $DIR/../ChromeExtension/manifest.json https://raw.githubusercontent.com/ALiangLiang/SurvivHacks/master/ChromeExtension/manifest.json
