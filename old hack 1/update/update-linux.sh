echo Updating
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
wget -O $DIR/../ChromeExtension/init.js https://raw.githubusercontent.com/ALiangLiang/SurvivHacks/master/ChromeExtension/init.js
wget -O $DIR/../ChromeExtension/background.js https://raw.githubusercontent.com/ALiangLiang/SurvivHacks/master/ChromeExtension/background.js
wget -O $DIR/../ChromeExtension/manifest.json https://raw.githubusercontent.com/ALiangLiang/SurvivHacks/master/ChromeExtension/manifest.json
