$(document).ready(function(){
    getList(1);
});

// video 12개 조회
function getList(currentNumber) {
    console.log("getList");
    $.ajax({
        type: "GET",
        url: host + `/tenSeconds/list/${currentNumber}`,
        success: function (response) {
            let list = `${response["videoList"]}`;

            let startPage = `${response["startPage"]}`;
            let endPage = `${response["endPage"]}`; // 마지막 페이지 번호
            let prev = `${response["prev"]}`; // 이전 버튼
            let next = `${response["next"]}`; // 다음 버튼

            $(".video-container").empty();

            for (let i=0; i<list.length; i++) {
                videoListPost(list[i], i);
            }
            pagination(currentNumber, startPage, endPage, prev, next);
        }
    })
}

// 게시글 코드
function videoListPost(article, index) {
    let tempHtml = `<div class="video-item" id="${index}">
                        <div class="video-thumbnail adme-scale-animation" onclick="videoModal(${article["id"]})">
                            <img src="${"files/" + "thumb_" + article["uuid"] +".jpg"}" alt=${"video"+article["id"]+"_thumbnail"}>
                        </div>
                        <div class="video-title" onclick="videoModal(${article["id"]})">
                            <a class="title" href="#">${article["title"]}</a>
                        </div>
                    </div>`;
    $(".video-container").append(tempHtml);
}

// 페이지 버튼 생성
function pagination(currentNumber, startPage, endPage, prev, next) {
    let tempHtml = ``;

    // 이전 페이지가 있다면 < 표시
    if (prev) {
        tempHtml += `<div><a href="#" onclick="beforeClick(${currentNumber})">&lt;</a></div>`;
    }

    // 페이징 번호 표시
    for (let i = startPage; i <= endPage; i++) {
        if (currentNumber === i) {
            tempHtml += `<div><a href="#">${i}</a></div>`;
        } else {
            tempHtml += `<div><a href="#" onclick="getList(${i})">${i}</a></div>`;
        }
    }

    // 다음 페이지가 있다면 < 표시
    if (next) {
        tempHtml += `<div><a href="#" onclick="nextClick(${currentNumber})">&gt;</a></div>`;
    }

    $('.paging').html(tempHtml);
}
function beforeClick(currentNumber) {
    getList(currentNumber - 1);
}
function nextClick(currentNumber) {
    getList(currentNumber + 1);
}


// video 단건조회
function videoModal(id) {
    showModal(id);
    $(".modal-content").fadeIn(100);
    $(".modal-container").fadeIn(100);
}
// 모달 활성화 및 아이템 설정
function showModal(id) {
    $.ajax({
        type: "GET",
        url: host + '/tenSeconds/video/'+id,
        headers: {"X-AUTH-TOKEN": cookie},
        success: function (response) {
            let title = response['title'];
            let videoId = response['id'];
            let videoPath = response['uploadPath'] + response['uuid'] + ".mp4";
            let nickname = response['nickname'];
            let date = response['videoDate'];
            let content = response['content'];

            $(".modal-title").text(title);
            $(".modal-video").attr("id", videoId).get(0).play();
            $(".modal-video>source").attr("src", videoPath);
            $(".content-nickname").text(nickname);
            $(".content-date").text(date.split("T")[0].replaceAll("-","."));
            $(".video-content>textarea").text(content);

            $(".video-modify-button").attr("onclick", "modifyLink("+videoId+")");

            // $(".modal-video").get(0).play();
        }
    });
}