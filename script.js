let videosListSection = document.querySelector('.videos-list');
const videoPlayerSource = document.querySelector('.video-player source');
const videoPlayer = document.querySelector('.video-player');

const currentURL = clipUrl(window.location.href, "getData", false);
const urlToContent = "https://driveapi.pythonanywhere.com/logout?url=" + currentURL;

// document.querySelector('.console').innerHTML = currentURL;
function clipUrl(str, to, include) {
    if (include === void 0) {
      include = false;
    }
    return str.substr(0, str.indexOf(to) + (include ? to.length : 0));
  }

function signOut() {
    return window.location.assign(urlToContent);
}

// Fetch data from api
async function getapi(url) {  
    const response = await fetch(url);
    let data = await response.json();
    let files = data;
    return files;
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const uniKey = urlParams.get('key');

const api_url = "https://driveapi.pythonanywhere.com/getdata?key=" + uniKey;

function createElement(element, classNames, eleID, parentToAppend) {
    el = document.createElement(element);
    if (classNames.length > 0) {
        classNames.forEach((className) => {
            el.classList.add(className);
        })
    }
    if (eleID) {
        el.setAttribute('id', eleID)
    } 
    if (parentToAppend) {
        parentToAppend.appendChild(el)
    } 
    return el
}

function sortByKey(data, key) {
    if (data === undefined) return;
    let sortedData;
    sortedData = data.sort((a, b) => {
        let x = a[key];
        let y = b[key];
        if (x > y) {return 1;}
        if (x < y) {return -1;}
        return 0;
    })
    return sortedData;
} 

function getDrive(driveArray) {
    // console.log(driveArray)
    let sortedDriveArray = sortByKey(driveArray, "folderName")
    
    sortedDriveArray.forEach((file) => {    
        let folderEle = createElement('div', ['folder'], file.folderId, videosListSection)
        let folderEleTitle = createElement('h2', ['folder-title'], '', folderEle)
        folderEleTitle.innerHTML = file.folderName;


        let sortedfolderContent = sortByKey(file.folderContent, "name")
        // console.log(sortedfolderContent)
        if (sortedfolderContent.length > 0) {
            sortedfolderContent.forEach((video) => {
                // console.log(video)
                let folderContentEle = createElement('div', ['video'], '', folderEle)
                let videoSourceEle = createElement('h3', [], '', folderContentEle)
                videoSourceEle.innerHTML = video.name;
                videoSourceEle.addEventListener('click', () => {
                    videoPlayer.pause();
                    videoPlayerSource.setAttribute('src', video.webContentLink+'&confirm=t'); 
                    videoPlayer.load();
                    videoPlayer.play();                   
                })
            })

        }
    })
}


getapi(api_url).then((val) => {
    getDrive(val)
});



//Go through the drive content

// console.log("Drive Content", driveContent)  


