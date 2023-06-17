let videosListSection = document.querySelector('.videos-list');
const videoPlayerSource = document.querySelector('.video-player source');
const videoPlayer = document.querySelector('.video-player');
const mainTitle = document.querySelector('.title');

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

function addFolderExpand(ele, className, classToToggle) {
    const allChildren = ele.querySelectorAll('.'+className);

    ele.querySelector('h2').addEventListener('click', () => {
        allChildren.forEach((child) => {
            child.classList.toggle(classToToggle);
        })
    })
}

function getDrive(driveArray) {
    let rootElement = [];
    let videoCounter = 0;
    console.log({driveArray})
    let sortedDriveArray = sortByKey(driveArray, "folderName")
    let indexOfFolderWithFirstVideo = [];
    console.log({sortedDriveArray})
    
    sortedDriveArray.forEach((file, index) => {    
        let folderEle = createElement('div', ['folder'], file.folderId, videosListSection)
        let folderEleTitle = createElement('h2', ['folder-title'], '', folderEle)
        folderEleTitle.innerHTML = file.folderName;

        if (rootElement.length == 0) {
            rootElement.push(file);
        } else {
            if (file.folderParent == rootElement[0].folderId) {
                null;
            } else {
                rootElement[0] = file;
            }
        }
        

        console.log({file: file})
        if (index != 0) {
            let sortedfolderContent = sortByKey(file.folderContent, "name")
            console.log(sortedfolderContent)

            if (sortedfolderContent.length > 0) {
                indexOfFolderWithFirstVideo.length == 0 ? indexOfFolderWithFirstVideo.push(index) : null;
                sortedfolderContent.forEach((video,i) => {
                    // console.log(video)
                    let folderContentEle = createElement('div', ['video'], '', folderEle)
                    let videoSourceEle = createElement('h3', [], '', folderContentEle)
                    videoSourceEle.innerHTML = video.name;

                    //Set video link as an attribute to the element
                    videoSourceEle.setAttribute('data-video-src', video.webContentLink+'&confirm=t');

                    //Set a counter on each videos
                    videoSourceEle.setAttribute('data-video-num', videoCounter);
                    videoCounter++;

                    //Load first video 
                    if (i == 0 && index == indexOfFolderWithFirstVideo[0]) {
                        videoPlayerSource.setAttribute('src', video.webContentLink+'&confirm=t');
                        videoPlayerSource.setAttribute('data-video-playing', videoSourceEle.getAttribute('data-video-num'));
                        videoSourceEle.classList.add('selected-video');
                        videoPlayer.load();
                        // videoPlayer.play();
                    } 

                    //Add click listener to each video label to be able to change videos on click
                    videoSourceEle.addEventListener('click', () => {
                        document.querySelector('.selected-video').classList.remove('selected-video');
                        videoSourceEle.classList.add('selected-video');                
                        videoPlayer.pause();
                        videoPlayerSource.setAttribute('src', video.webContentLink+'&confirm=t'); 
                        videoPlayerSource.setAttribute('data-video-playing', videoSourceEle.getAttribute('data-video-num'));
                        videoPlayer.load();
                        videoPlayer.play();                   
                    })
                })

            }
        }
            
       
        addFolderExpand(folderEle, 'video', 'folder-collapse');
    })
    mainTitle.innerHTML = rootElement[0].folderName;
    let rootDiv = document.getElementById(rootElement[0].folderId)
    rootDiv.remove();
}

function playNext(videoEle) {
    const srcEle = videoEle.querySelector('source');
    const currentVideo = parseInt(srcEle.getAttribute('data-video-playing'));
    const nextVideo = currentVideo + 1;

    document.querySelector('.selected-video').classList.remove('selected-video');
    document.querySelector('[data-video-num = "' + nextVideo + '"]').classList.add('selected-video');

    const nextVideoSrc = document.querySelector('[data-video-num = "' + nextVideo + '"]').getAttribute('data-video-src')
    videoPlayerSource.setAttribute('src', nextVideoSrc); 
    videoPlayer.load();
    videoPlayer.play();
    // console.log(nextVideoSrc);
}


getapi(api_url).then((val) => {
    getDrive(val)
});



//Go through the drive content

// console.log("Drive Content", driveContent)  


